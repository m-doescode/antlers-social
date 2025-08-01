const pkg = require('./package.json')

const DARK_SPLASH_ANDROID_BACKGROUND = '#0e1610'

module.exports = function (_config) {
  /**
   * App version number. Should be incremented as part of a release cycle.
   */
  const VERSION = pkg.version

  /**
   * Uses built-in Expo env vars
   *
   * @see https://docs.expo.dev/build-reference/variables/#built-in-environment-variables
   */
  const PLATFORM = process.env.EAS_BUILD_PLATFORM

  const IS_TESTFLIGHT = process.env.EXPO_PUBLIC_ENV === 'testflight'
  const IS_PRODUCTION = process.env.EXPO_PUBLIC_ENV === 'production'
  const IS_DEV = !IS_TESTFLIGHT || !IS_PRODUCTION

  const ASSOCIATED_DOMAINS = [
    'applinks:deer.social',
    // When testing local services, enter an ngrok (et al) domain here. It must use a standard HTTP/HTTPS port.
    ...(IS_DEV || IS_TESTFLIGHT ? [] : []),
  ]

  // const UPDATES_ENABLED = IS_TESTFLIGHT || IS_PRODUCTION

  const USE_SENTRY = Boolean(process.env.SENTRY_AUTH_TOKEN)

  return {
    expo: {
      version: VERSION,
      name: 'deer.social',
      slug: 'deer',
      scheme: ['bluesky', 'deer'],
      // owner: 'blueskysocial',
      // owner: 'neema.brown',
      runtimeVersion: {
        policy: 'appVersion',
      },
      icon: './assets/app-icons/ios_icon_default_light.png',
      userInterfaceStyle: 'automatic',
      primaryColor: '#4b9b6c',
      ios: {
        supportsTablet: false,
        bundleIdentifier: 'social.deer',
        config: {
          usesNonExemptEncryption: false,
        },
        infoPlist: {
          UIBackgroundModes: ['remote-notification'],
          NSCameraUsageDescription:
            'Used for profile pictures, posts, and other kinds of content.',
          NSMicrophoneUsageDescription:
            'Used for posts and other kinds of content.',
          NSPhotoLibraryAddUsageDescription:
            'Used to save images to your library.',
          NSPhotoLibraryUsageDescription:
            'Used for profile pictures, posts, and other kinds of content',
          CFBundleSpokenName: 'deer.social',
          CFBundleLocalizations: [
            'en',
            'an',
            'ast',
            'ca',
            'cy',
            'da',
            'de',
            'el',
            'eo',
            'es',
            'eu',
            'fi',
            'fr',
            'fy',
            'ga',
            'gd',
            'gl',
            'hi',
            'hu',
            'ia',
            'id',
            'it',
            'ja',
            'km',
            'ko',
            'ne',
            'nl',
            'pl',
            'pt-BR',
            'pt-PT',
            'ro',
            'ru',
            'sv',
            'th',
            'tr',
            'uk',
            'vi',
            'yue',
            'zh-Hans',
            'zh-Hant',
          ],
        },
        associatedDomains: ASSOCIATED_DOMAINS,
        entitlements: {
          'com.apple.developer.kernel.increased-memory-limit': true,
          'com.apple.developer.kernel.extended-virtual-addressing': true,
          'com.apple.security.application-groups': 'group.social.deer',
        },
        privacyManifests: {
          NSPrivacyAccessedAPITypes: [
            {
              NSPrivacyAccessedAPIType:
                'NSPrivacyAccessedAPICategoryFileTimestamp',
              NSPrivacyAccessedAPITypeReasons: ['C617.1', '3B52.1', '0A2A.1'],
            },
            {
              NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
              NSPrivacyAccessedAPITypeReasons: ['E174.1', '85F4.1'],
            },
            {
              NSPrivacyAccessedAPIType:
                'NSPrivacyAccessedAPICategorySystemBootTime',
              NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
            },
            {
              NSPrivacyAccessedAPIType:
                'NSPrivacyAccessedAPICategoryUserDefaults',
              NSPrivacyAccessedAPITypeReasons: ['CA92.1', '1C8F.1'],
            },
          ],
        },
      },
      androidStatusBar: {
        barStyle: 'light-content',
      },
      // Dark nav bar in light mode is better than light nav bar in dark mode
      androidNavigationBar: {
        barStyle: 'light-content',
      },
      android: {
        icon: './assets/app-icons/android_icon_default_light.png',
        adaptiveIcon: {
          foregroundImage: './assets/icon-android-foreground.png',
          monochromeImage: './assets/icon-android-foreground.png',
          backgroundImage: './assets/icon-android-background.png',
          backgroundColor: '#4b9b6c',
        },
        googleServicesFile: './google-services.json',
        package: 'dev.maelstrom.deer_social_fork',
        intentFilters: [
          {
            action: 'VIEW',
            autoVerify: true,
            data: [
              {
                scheme: 'https',
                host: 'deer.social',
              },
              {
                scheme: 'https',
                host: 'bsky.app',
              },
              IS_DEV && {
                scheme: 'http',
                host: 'localhost:19006',
              },
            ],
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
      },
      web: {
        favicon: './assets/favicon.png',
      },
      // updates: {
      //   url: 'https://updates.bsky.app/manifest',
      //   enabled: UPDATES_ENABLED,
      //   fallbackToCacheTimeout: 30000,
      //   codeSigningCertificate: UPDATES_ENABLED
      //     ? './code-signing/certificate.pem'
      //     : undefined,
      //   codeSigningMetadata: UPDATES_ENABLED
      //     ? {
      //         keyid: 'main',
      //         alg: 'rsa-v1_5-sha256',
      //       }
      //     : undefined,
      //   checkAutomatically: 'NEVER',
      // },
      plugins: [
        'expo-video',
        'expo-localization',
        'expo-web-browser',
        [
          'react-native-edge-to-edge',
          {android: {enforceNavigationBarContrast: false}},
        ],
        USE_SENTRY && [
          '@sentry/react-native/expo',
          {
            organization: 'blueskyweb',
            project: 'app',
            url: 'https://sentry.io',
          },
        ],
        [
          'expo-build-properties',
          {
            ios: {
              deploymentTarget: '15.1',
              newArchEnabled: false,
            },
            android: {
              compileSdkVersion: 35,
              targetSdkVersion: 35,
              buildToolsVersion: '35.0.0',
              newArchEnabled: false,
            },
          },
        ],
        [
          'expo-notifications',
          {
            icon: './assets/icon-android-notification.png',
            color: '#4b9b6c',
            sounds: PLATFORM === 'ios' ? ['assets/dm.aiff'] : ['assets/dm.mp3'],
          },
        ],
        'react-native-compressor',
        [
          '@bitdrift/react-native',
          {
            networkInstrumentation: true,
          },
        ],
        './plugins/starterPackAppClipExtension/withStarterPackAppClip.js',
        './plugins/withGradleJVMHeapSizeIncrease.js',
        './plugins/withAndroidManifestPlugin.js',
        './plugins/withAndroidManifestFCMIconPlugin.js',
        './plugins/withAndroidStylesAccentColorPlugin.js',
        './plugins/withAndroidDayNightThemePlugin.js',
        './plugins/withAndroidNoJitpackPlugin.js',
        './plugins/shareExtension/withShareExtensions.js',
        './plugins/notificationsExtension/withNotificationsExtension.js',
        [
          'expo-font',
          {
            fonts: [
              './assets/fonts/inter/InterVariable.woff2',
              './assets/fonts/inter/InterVariable-Italic.woff2',
              // Android only
              './assets/fonts/inter/Inter-Regular.otf',
              './assets/fonts/inter/Inter-Italic.otf',
              './assets/fonts/inter/Inter-SemiBold.otf',
              './assets/fonts/inter/Inter-SemiBoldItalic.otf',
              './assets/fonts/inter/Inter-ExtraBold.otf',
              './assets/fonts/inter/Inter-ExtraBoldItalic.otf',
            ],
          },
        ],
        [
          'expo-splash-screen',
          {
            ios: {
              enableFullScreenImage_legacy: true,
              backgroundColor: '#ffffff',
              image: './assets/splash.png',
              resizeMode: 'cover',
              dark: {
                enableFullScreenImage_legacy: true,
                backgroundColor: '#03180c',
                image: './assets/splash-dark.png',
                resizeMode: 'cover',
              },
            },
            android: {
              backgroundColor: '#4b9b6c',
              image: './assets/splash-android-icon.png',
              imageWidth: 150,
              dark: {
                backgroundColor: '#01331a',
                image: './assets/splash-android-icon-dark.png',
                imageWidth: 150,
              },
            },
          },
        ],
        [
          '@mozzius/expo-dynamic-app-icon',
          {
            /**
             * Default set
             */
            default_light: {
              ios: './assets/app-icons/ios_icon_default_light.png',
              android: './assets/app-icons/android_icon_default_light.png',
              prerendered: true,
            },
            default_dark: {
              ios: './assets/app-icons/ios_icon_default_dark.png',
              android: './assets/app-icons/android_icon_default_dark.png',
              prerendered: true,
            },

            /**
             * Bluesky+ core set
             */
            // core_aurora: {
            //   ios: './assets/app-icons/ios_icon_core_aurora.png',
            //   android: './assets/app-icons/android_icon_core_aurora.png',
            //   prerendered: true,
            // },
            // core_bonfire: {
            //   ios: './assets/app-icons/ios_icon_core_bonfire.png',
            //   android: './assets/app-icons/android_icon_core_bonfire.png',
            //   prerendered: true,
            // },
            // core_sunrise: {
            //   ios: './assets/app-icons/ios_icon_core_sunrise.png',
            //   android: './assets/app-icons/android_icon_core_sunrise.png',
            //   prerendered: true,
            // },
            // core_sunset: {
            //   ios: './assets/app-icons/ios_icon_core_sunset.png',
            //   android: './assets/app-icons/android_icon_core_sunset.png',
            //   prerendered: true,
            // },
            // core_midnight: {
            //   ios: './assets/app-icons/ios_icon_core_midnight.png',
            //   android: './assets/app-icons/android_icon_core_midnight.png',
            //   prerendered: true,
            // },
            // core_flat_blue: {
            //   ios: './assets/app-icons/ios_icon_core_flat_blue.png',
            //   android: './assets/app-icons/android_icon_core_flat_blue.png',
            //   prerendered: true,
            // },
            // core_flat_white: {
            //   ios: './assets/app-icons/ios_icon_core_flat_white.png',
            //   android: './assets/app-icons/android_icon_core_flat_white.png',
            //   prerendered: true,
            // },
            // core_flat_black: {
            //   ios: './assets/app-icons/ios_icon_core_flat_black.png',
            //   android: './assets/app-icons/android_icon_core_flat_black.png',
            //   prerendered: true,
            // },
            // core_classic: {
            //   ios: './assets/app-icons/ios_icon_core_classic.png',
            //   android: './assets/app-icons/android_icon_core_classic.png',
            //   prerendered: true,
            // },
          },
        ],
        ['expo-screen-orientation', {initialOrientation: 'PORTRAIT_UP'}],
        [
          'react-native-vision-camera',
          {
            enableLocation: false,
            cameraPermissionText: 'deer.social needs access to your camera.',
            enableMicrophonePermission: true,
            microphonePermissionText:
              'deer.social needs access to your microphone.',
          },
        ],
      ].filter(Boolean),
      extra: {
        eas: {
          build: {
            experimental: {
              ios: {
                // appExtensions: [
                //   {
                //     targetName: 'Share-with-Bluesky',
                //     bundleIdentifier: 'xyz.blueskyweb.app.Share-with-Bluesky',
                //     entitlements: {
                //       'com.apple.security.application-groups': [
                //         'group.app.bsky',
                //       ],
                //     },
                //   },
                //   {
                //     targetName: 'BlueskyNSE',
                //     bundleIdentifier: 'xyz.blueskyweb.app.BlueskyNSE',
                //     entitlements: {
                //       'com.apple.security.application-groups': [
                //         'group.app.bsky',
                //       ],
                //     },
                //   },
                //   {
                //     targetName: 'BlueskyClip',
                //     bundleIdentifier: 'xyz.blueskyweb.app.AppClip',
                //   },
                // ],
              },
            },
          },
          //projectId: '55bd077a-d905-4184-9c7f-94789ba0f302',
          projectId: '86ff94e3-dce0-4f7c-99f4-1651a2f1bc2a',
        },
      },
    },
  }
}
