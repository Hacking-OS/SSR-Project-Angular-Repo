/**
 * Enum representing error captions.
 */
export const enum ErrorCaption {
  NoNetwork = 'No Network',
  AccessDenied = 'Access Denied!',
  NotFound = 'Not Found',
  CrossSiteError = 'Server Error',
  BadRequestError = 'Error',
  ServerError = 'Server Error',
  RequestTimeoutError = 'Request Timed out',
  Precondition = 'Error',
  Seperator = ':'
}

/**
 * Enum representing error details.
 */
export const enum ErrorDetail {
  NoNetwork = 'The server cannot be reached',
  AccessDenied = '',
  NotFound = 'The target resource cannot be found',
  CrossSiteError = 'Invalid characters found',
  BadRequestError = 'Encountered an Unexpected Error',
  ServerError = 'Encountered an Unexpected Error',
  RequestTimeoutError = 'Server took too long to respond. Please check your internet connection',
  Precondition = 'Data Failed'
}
