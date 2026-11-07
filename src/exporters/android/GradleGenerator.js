/* Generates settings.gradle.kts, root build.gradle.kts, app/build.gradle.kts,
   and gradle.properties with standard stable Jetpack Compose dependencies. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var android = S.exporters.android = S.exporters.android || {};

  var GradleGenerator = android.GradleGenerator = {
    generateSettingsGradle: function (projectName) {
      projectName = projectName || 'DroidLabApp';
      return [
        'pluginManagement {',
        '    repositories {',
        '        google {',
        '            content {',
        '                includeGroupByRegex("com\\\\.android.*")',
        '                includeGroupByRegex("com\\\\.google.*")',
        '                includeGroupByRegex("androidx.*")',
        '            }',
        '        }',
        '        mavenCentral()',
        '        gradlePluginPortal()',
        '    }',
        '}',
        'dependencyResolutionManagement {',
        '    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)',
        '    repositories {',
        '        google()',
        '        mavenCentral()',
        '    }',
        '}',
        '',
        'rootProject.name = "' + projectName + '"',
        'include(":app")',
        ''
      ].join('\n');
    },

    generateRootBuildGradle: function () {
      return [
        '// Top-level build file where you can add configuration options common to all sub-projects/modules.',
        'plugins {',
        '    alias(libs.plugins.android.application) apply false',
        '    alias(libs.plugins.kotlin.android) apply false',
        '    alias(libs.plugins.compose.compiler) apply false',
        '}',
        ''
      ].join('\n');
    },

    generateGradleProperties: function () {
      return [
        'org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8',
        'android.useAndroidX=true',
        'android.nonTransitiveRClass=true',
        'kotlin.code.style=official',
        ''
      ].join('\n');
    },

    generateWrapperProperties: function () {
      return [
        'distributionBase=GRADLE_USER_HOME',
        'distributionPath=wrapper/dists',
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip',
        'zipStoreBase=GRADLE_USER_HOME',
        'zipStorePath=wrapper/dists',
        ''
      ].join('\n');
    },

    generateAppBuildGradle: function (opts) {
      opts = opts || {};
      var packageName = opts.packageName || 'com.example.droidlab';
      var minSdk = opts.minSdk || 24;
      var targetSdk = opts.targetSdk || 34;

      return [
        'plugins {',
        '    id("com.android.application")',
        '    id("org.jetbrains.kotlin.android")',
        '    id("org.jetbrains.kotlin.plugin.compose")',
        '}',
        '',
        'android {',
        '    namespace = "' + packageName + '"',
        '    compileSdk = ' + targetSdk,
        '',
        '    defaultConfig {',
        '        applicationId = "' + packageName + '"',
        '        minSdk = ' + minSdk,
        '        targetSdk = ' + targetSdk,
        '        versionCode = 1',
        '        versionName = "1.0.0"',
        '',
        '        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"',
        '        vectorDrawables {',
        '            useSupportLibrary = true',
        '        }',
        '    }',
        '',
        '    buildTypes {',
        '        release {',
        '            isMinifyEnabled = false',
        '            proguardFiles(',
        '                getDefaultProguardFile("proguard-android-optimize.txt"),',
        '                "proguard-rules.pro"',
        '            )',
        '        }',
        '    }',
        '    compileOptions {',
        '        sourceCompatibility = JavaVersion.VERSION_17',
        '        targetCompatibility = JavaVersion.VERSION_17',
        '    }',
        '    kotlinOptions {',
        '        jvmTarget = "17"',
        '    }',
        '    buildFeatures {',
        '        compose = true',
        '    }',
        '}',
        '',
        'dependencies {',
        '    val composeBom = platform("androidx.compose:compose-bom:2024.08.00")',
        '    implementation(composeBom)',
        '    androidTestImplementation(composeBom)',
        '',
        '    // Core Android & Lifecycle',
        '    implementation("androidx.core:core-ktx:1.13.1")',
        '    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")',
        '    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.4")',
        '    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.4")',
        '    implementation("androidx.activity:activity-compose:1.9.1")',
        '',
        '    // Jetpack Compose & Material 3',
        '    implementation("androidx.compose.ui:ui")',
        '    implementation("androidx.compose.ui:ui-graphics")',
        '    implementation("androidx.compose.ui:ui-tooling-preview")',
        '    implementation("androidx.compose.material3:material3")',
        '    implementation("androidx.compose.material:material-icons-extended")',
        '    implementation("androidx.navigation:navigation-compose:2.7.7")',
        '',
        '    // Image Loading',
        '    implementation("io.coil-kt:coil-compose:2.7.0")',
        '',
        '    // Tooling & Debugging',
        '    debugImplementation("androidx.compose.ui:ui-tooling")',
        '    debugImplementation("androidx.compose.ui:ui-test-manifest")',
        '}',
        ''
      ].join('\n');
    }
  };
})();
