import type { ConfigContext, ExpoConfig } from 'expo/config';

// app.json 의 설정에 .env 값이 필요한 네이티브 설정을 더한다 (app.json 은 환경 변수를 읽지 못한다).
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    // 네이버 지도: 지도 키를 AndroidManifest / Info.plist 에 넣고 위치 권한을 추가한다
    [
      '@mj-studio/react-native-naver-map',
      {
        client_id: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID,
        android: { ACCESS_FINE_LOCATION: true, ACCESS_COARSE_LOCATION: true },
      },
    ],
    // 네이버 지도 Android SDK 는 네이버 전용 Maven 저장소에서 받는다
    [
      'expo-build-properties',
      { android: { extraMavenRepos: ['https://repository.map.naver.com/archive/maven'] } },
    ],
  ],
});
