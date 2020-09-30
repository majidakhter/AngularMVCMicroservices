import { NgxLoggerLevel } from 'ngx-logger';
/* tslint:disable */
export const environment = {
  production: false,
  isStandalone: true,
  baseApiPath: 'https://localhost:44308/',
  loginUser: {
    username: 'apiadmin',
    password: 'api',
    timeout: '1:00:00'
  },
  logger: {
    logUrl: '/api/local/logs',
    logLevel: NgxLoggerLevel.WARN,
    serverLogLevel: NgxLoggerLevel.OFF
  },
  auth: {
    'clientId': '1d024eff-e9dc-4e43-9839-12eaaac59ada',
    'clientSecret': 'SKIebNWrS7KcOWqKoUNKhaV2zQJuovbWfozkhgHuBKo=',
    'realm': 'apiazuredevge.onmicrosoft.com/wfm/tm/dev1/web-services',
    'directory': '147a2b71-5ce9-4933-94c4-2054328de565',
    'accessToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSIsImtpZCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSJ9.eyJhdWQiOiJodHRwczovL2FwaWF6dXJlZGV2Z2Uub25taWNyb3NvZnQuY29tL3dmbS90bS9kZXYxL3dlYi1zZXJ2aWNlcyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzE0N2EyYjcxLTVjZTktNDkzMy05NGM0LTIwNTQzMjhkZTU2NS8iLCJpYXQiOjE1OTczODY3NTMsIm5iZiI6MTU5NzM4Njc1MywiZXhwIjoxNTk3MzkwNjUzLCJhaW8iOiJFMkJnWUZDcW5kMWdieTdWTVpPZC8zemltZU5kQUE9PSIsImFwcGlkIjoiMWQwMjRlZmYtZTlkYy00ZTQzLTk4MzktMTJlYWFhYzU5YWRhIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTQ3YTJiNzEtNWNlOS00OTMzLTk0YzQtMjA1NDMyOGRlNTY1LyIsIm9pZCI6IjE4MGMzOTE4LTRiNTItNDdjMS1iNDc2LTk4ZTM4ZGFiZjExNiIsInJvbGVzIjpbIkNhbGxTZWN1cmVFbmRwb2ludHMiXSwic3ViIjoiMTgwYzM5MTgtNGI1Mi00N2MxLWI0NzYtOThlMzhkYWJmMTE2IiwidGlkIjoiMTQ3YTJiNzEtNWNlOS00OTMzLTk0YzQtMjA1NDMyOGRlNTY1IiwidXRpIjoiajZ1bng5cTBua0NleUV2Q1FQOU9BUSIsInZlciI6IjEuMCJ9.aTIwreVybaE_llquVtd1g035z3ymVnXR7SMH1ElctQTy25GFWbBz-hiLpaVi4x4ev-gWq1raMq_IAiqCKWhJsSkRRTmsCZB6TU50cnJlqzQQpyLE2PbQKmZ1DwiPYwAoPkKJh4cvgUF1jOsKl3ww59znr4OxaTY5fnJXtbIXNkXhdulhprj3HvtcJk3rbEB4YAwKjp9fYkI6Gkg0-wA_q5198--QMYB5s7Lvm_nblXzWlLzLdcXg2BBs9uZih8qJYQwe7P0m0WmOgLS62vgcjcsGZShqfF7YzG8hjzvDg5ZPJnu08VKBW8OUsKolZxPniEdc1xoIqMfiJeWXTjlCDA',
  }
};
