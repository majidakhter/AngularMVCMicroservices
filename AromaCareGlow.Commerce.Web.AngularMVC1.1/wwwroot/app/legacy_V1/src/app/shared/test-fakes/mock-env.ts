import { EnvironmentService } from 'src/app/environment/environment.service';


/*istanbul ignore next*/
export const MockEnvService: EnvironmentService = {
  baseApiPath: './Base/',
  isStandalone: false,
  isLocal: false,
  loginUser: {
    username: 'admin',
    password: 'password',
    timeout: '1:00:00'
  },
  auth: {
    clientId: 'client_id',
    clientSecret: 'client_secret',
    realm: 'http://  localhost',
    directory: '00000000-0000-0000-0000-000000000000',
    //  tslint:disable-next-line:max-line-length
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik4tbEMwbi05REFMcXdodUhZbkhRNjNHZUNYYyIsImtpZCI6Ik4tbEMwbi05REFMcXdodUhZbkhRNjNHZUNYYyJ9.eyJhdWQiOiJodHRwczovL2FwaWF6dXJlZGV2Z2Uub25taWNyb3NvZnQuY29tL3RtL3dlYi1zZXJ2aWNlcyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzE0N2EyYjcxLTVjZTktNDkzMy05NGM0LTIwNTQzMjhkZTU2NS8iLCJpYXQiOjE1NTUzMjA5NjksIm5iZiI6MTU1NTMyMDk2OSwiZXhwIjoxNTU1MzI0ODY5LCJhaW8iOiI0MlpnWU5DZWVYRHphYjBwUjZ4enYvNmFlMmVDSXdBPSIsImFwcGlkIjoiYWIyODNkYmQtY2VmOC00YTQzLWI4OWYtOTRmMzg2ZTY0MDkzIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTQ3YTJiNzEtNWNlOS00OTMzLTk0YzQtMjA1NDMyOGRlNTY1LyIsIm9pZCI6IjI0MTNkMjQ3LWMwOTgtNDNlMi1hOWNhLTk0NGU3MzgzZTA5MiIsInN1YiI6IjI0MTNkMjQ3LWMwOTgtNDNlMi1hOWNhLTk0NGU3MzgzZTA5MiIsInRpZCI6IjE0N2EyYjcxLTVjZTktNDkzMy05NGM0LTIwNTQzMjhkZTU2NSIsInV0aSI6IkMtNjB0YVJXOFVhOTB0aEZERzFZQUEiLCJ2ZXIiOiIxLjAifQ.F5Uc5kaW_D2-Q5bZctcz1_9SvqhZzB5bVNxaCCdkQJaom6IRz2MqymUJmzpWGZbiQTIJlU3LKSfFSmerbMZxdLt3_aGF5BJlM1GXj5-rf2e7zWz7uvcrh5Ae8dZ8h1UqhIBc81sE4H49hHeH4fZ4e-eYu0jGNjVH7N4CnW1J5Kr9IJ-7zHfJMKwvh_6-Mya41b_9NfXcChzio68D1ynXLDFzNbAJ4eZog1-Wdn0kA8AC_nb0GdyKF7XH0na13DJsk-8X92Uam8e4FvJgEuB89oTWlulaCikFsVH0Ki5Jp0rc_F0qSS1MgRa2XVdtwQtsUDiuD3ejV4x6dfHjV7T9BA',
    tokenRequested: '2019-04-19T18:10:10.631Z'
  }
};
