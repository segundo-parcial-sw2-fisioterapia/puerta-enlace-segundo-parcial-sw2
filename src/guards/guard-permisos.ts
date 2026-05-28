import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { RolSistema } from '../permisos/permisos.types';
import { PERMISOS_GRAPHQL_CLINICA } from '../permisos/permisos-graphql-clinica.config';
import { PERMISOS_GRAPHQL_ADMINISTRATIVA } from '../permisos/permisos-graphql-administrativa.config';
import { PERMISOS_REST_BI } from '../permisos/permisos-rest-bi.config';

interface UsuarioAutenticado {
  id: string;
  correo: string;
  roles: string[];
}

/**
 * Policy Enforcement Point centralizado del gateway.
 * Decide si una petición puede pasar basándose en el rol JWT del usuario.
 * Principio fail-secure: operación no registrada en la tabla = denegado (403).
 * Debe ejecutarse siempre después de GuardsAutenticacion.
 */
@Injectable()
export class GuardPermisos implements CanActivate {
  private readonly logger = new Logger(GuardPermisos.name);

  canActivate(contextoEjecucion: ExecutionContext): boolean {
    const req = contextoEjecucion
      .switchToHttp()
      .getRequest<Request & { user?: UsuarioAutenticado }>();

    const rolesUsuario = (req.user?.roles ?? []) as RolSistema[];

    const esGraphql =
      req.path === '/graphql' || req.path.startsWith('/graphql/');

    if (esGraphql) {
      return this.verificarPermisoGraphql(
        req.body as { query?: string },
        rolesUsuario,
      );
    }
    return this.verificarPermisoRest(req.method, req.path, rolesUsuario);
  }

  /**
   * Verifica que la operación GraphQL esté registrada y que el usuario tenga un rol permitido.
   */
  private verificarPermisoGraphql(
    body: { query?: string },
    rolesUsuario: RolSistema[],
  ): boolean {
    const operacionRaiz = this.obtenerOperacionGraphql(body?.query ?? '');

    if (!operacionRaiz) {
      this.logger.warn(
        'No se pudo determinar la operación GraphQL de la petición',
      );
      throw new ForbiddenException('Operación GraphQL no identificable');
    }

    const permisosGraphql = [
      ...PERMISOS_GRAPHQL_CLINICA,
      ...PERMISOS_GRAPHQL_ADMINISTRATIVA,
    ];

    const permiso = permisosGraphql.find((p) => p.operacion === operacionRaiz);

    if (!permiso) {
      this.logger.warn(
        `Operación GraphQL no registrada en la tabla de permisos: "${operacionRaiz}"`,
      );
      throw new ForbiddenException(`Operación no permitida: ${operacionRaiz}`);
    }

    const tieneRol = rolesUsuario.some((rol) => permiso.roles.includes(rol));
    if (!tieneRol) {
      this.logger.warn(
        `Acceso denegado a "${operacionRaiz}" — roles del usuario: [${rolesUsuario.join(', ')}]`,
      );
      throw new ForbiddenException(
        'No tienes los permisos necesarios para esta operación',
      );
    }

    return true;
  }

  /**
   * Verifica que la ruta REST esté registrada y que el usuario tenga un rol permitido.
   */
  private verificarPermisoRest(
    metodo: string,
    ruta: string,
    rolesUsuario: RolSistema[],
  ): boolean {
    const permisosRest = PERMISOS_REST_BI;

    const permiso = permisosRest.find(
      (p) =>
        p.metodo === (metodo.toUpperCase() as typeof p.metodo) &&
        this.coincideRuta(p.ruta, ruta),
    );

    if (!permiso) {
      this.logger.warn(
        `Ruta REST no registrada en la tabla de permisos: ${metodo.toUpperCase()} ${ruta}`,
      );
      throw new ForbiddenException(
        `Ruta no permitida: ${metodo.toUpperCase()} ${ruta}`,
      );
    }

    const tieneRol = rolesUsuario.some((rol) => permiso.roles.includes(rol));
    if (!tieneRol) {
      this.logger.warn(
        `Acceso denegado a "${metodo.toUpperCase()} ${ruta}" — roles del usuario: [${rolesUsuario.join(', ')}]`,
      );
      throw new ForbiddenException(
        'No tienes los permisos necesarios para esta ruta',
      );
    }

    return true;
  }

  /** Extrae el nombre del campo raíz de una query/mutation GraphQL. */
  private obtenerOperacionGraphql(query: string): string {
    if (!query) return '';
    try {
      let q = query.replace(/#.*$/gm, ' ');
      q = q.replace(/\([^)]*\)/g, ' ');
      const indexLlave = q.indexOf('{');
      if (indexLlave === -1) return '';
      const resto = q.substring(indexLlave + 1).trim();
      const coincidencia = resto.match(/^([a-zA-Z0-9_]+)/);
      return coincidencia ? coincidencia[1] : '';
    } catch {
      return '';
    }
  }

  /** Verifica si una ruta coincide con un patrón; soporta comodín * al final. */
  private coincideRuta(patron: string, ruta: string): boolean {
    if (patron.endsWith('*')) {
      const prefijo = patron.slice(0, -1);
      return ruta.startsWith(prefijo);
    }
    return patron === ruta;
  }
}
