export enum OK {
  code = 'ERM200',
  message = 'OK',
}

export enum BadRequest {
  code = 'ERM400',
  message = 'Solicitud malformada',
}

export enum NotFound {
  code = 'ERM404',
  message = 'Recurso no disponible',
}

export enum BafGateway {
  code = 'ERM500',
  message = 'Servicio no disponible',
}

export enum TimeOut {
  code = 'ERM408',
  message = 'Excedió el tiempo de conexión',
}
