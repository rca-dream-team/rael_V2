export default class Response<T = any> {
   constructor(
      public data?: T,
      public error?: Error,
      public message?: string,
      public success = !error,
   ) {}

   static success<T>(data: T, message?: string) {
      return new Response<T>(data, undefined, message);
   }

   static fail<T>(error: Error, message?: string) {
      return new Response<T>(undefined, error, message);
   }
}
