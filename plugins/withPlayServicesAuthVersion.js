
const { withProjectBuildGradle } = require('@expo/config-plugins');

const withPlayServicesAuthVersion = (config) => {
  return withProjectBuildGradle(config, (config) => {
    const marker = '// Dhunn Google Sign-In compatibility fix';

    let gradle = config.modResults.contents;

    if (!gradle.includes(marker)) {
      const fix = `
${marker}
allprojects {
  configurations.configureEach {
    resolutionStrategy {
      force 'com.google.android.gms:play-services-auth:21.6.0'
    }
  }
}
`;

      gradle = gradle.replace(
        /apply plugin: "expo-root-project"/,
        `${fix}\napply plugin: "expo-root-project"`
      );

      config.modResults.contents = gradle;
    }

    return config;
  });
};

module.exports = withPlayServicesAuthVersion;
