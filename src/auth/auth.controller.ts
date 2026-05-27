import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServicio: AuthService) {}

  /**
   * Inicia sesión con correo y contraseña.
   * Devuelve tokenAcceso, tokenRefresco y datos del usuario sin campos sensibles.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async iniciarSesion(@Body() loginDto: LoginDto) {
    const usuarioAutenticado = await this.authServicio.validarCredenciales(
      loginDto.correo,
      loginDto.contrasena,
    );
    const tokens = this.authServicio.emitirToken(usuarioAutenticado);

    return {
      ...tokens,
      usuario: {
        id: usuarioAutenticado.id,
        correo: usuarioAutenticado.correo,
        roles: usuarioAutenticado.roles,
        estado: usuarioAutenticado.estado,
        persona: usuarioAutenticado.persona,
      },
    };
  }

  /**
   * Renueva el token de acceso usando un token de refresco válido.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  renovarToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authServicio.renovarToken(refreshTokenDto.tokenRefresco);
  }

  /**
   * Cierra la sesión. Stateless: confirma al cliente que descarte los tokens.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  cerrarSesion() {
    return this.authServicio.cerrarSesion();
  }
}
