import { WebpayPlus } from 'transbank-sdk';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

// Configuración para entorno de INTEGRACIÓN (Test)
// Por defecto usa las credenciales de prueba públicas de Transbank
// Cuando pases a producción, deberás cambiar esto para usar variables de entorno reales.

const tx = new WebpayPlus.Transaction(
    new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
    )
);

export default tx;
