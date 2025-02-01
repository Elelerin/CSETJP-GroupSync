import { useState, useMemo, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, exchangeCodeAsync, revokeAsync, ResponseType} from 'expo-auth-session';
import { Button, Alert } from 'react-native';
import PillButton from '@/components/PillButton';

const PORT = process.env.PORT || 3000

WebBrowser.maybeCompleteAuthSession();

const clientId = '13524tn38254dqsrm1tsn52hc9';
const userPoolUrl =
  'https://us-east-2gnixjqqd3.auth.us-east-2.amazoncognito.com';
const redirectUri = "myapp://groups";

export default function Index() {
  const [authTokens, setAuthTokens] = useState(null);
  const discoveryDocument = useMemo(() => ({
    authorizationEndpoint: userPoolUrl + '/oauth2/authorize',
    tokenEndpoint: userPoolUrl + '/oauth2/token',
    revocationEndpoint: userPoolUrl + '/oauth2/revoke',
  }), []);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discoveryDocument
  );

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(
          exchangeTokenReq,
          discoveryDocument
        );
        setAuthTokens(exchangeTokenResponse);
      } catch (error) {
        console.error(error);
      }
    };
    if (response) {
      if (response.error) {
        Alert.alert(
          'Authentication error',
          response.params.error_description || 'something went wrong'
        );
        return;
      }
      if (response.type === 'success') {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        });
      }
    }
  }, [discoveryDocument, request, response]);

  const logout = async () => {
    const revokeResponse = await revokeAsync(
      {
        clientId: clientId,
        token: authTokens.refreshToken,
      },
      discoveryDocument
    );
    if (revokeResponse) {
      setAuthTokens(null);
    }
  };

  console.log('authTokens: ' + JSON.stringify(authTokens));
  return authTokens ? (
    <Button title="Logout" onPress={() => logout()} />
  ) : (
    <PillButton onPress={() => promptAsync()} icon={"plus"}/>
  );
}