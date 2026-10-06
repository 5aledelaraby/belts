import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["docs/**", "node_modules/**", "tmp/**"],
  },
  {
    files: ["apps/**/*.{ts,tsx,js,jsx}", "packages/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "regex": "^@vicuna/[^/]+/src(?:/|$)",
              "message": "Import workspace packages through their public package entry point, not an internal src path.",
            },
          ],
        },
      ],
      "@nx/enforce-module-boundaries": [
        "error",
        {
          allow: [],
          depConstraints: [
            // Scope dimension: applications compose the platform and business domains.
            {
              sourceTag: "scope:web",
              onlyDependOnLibsWithTags: [
                "scope:web",
                "scope:commerce",
                "scope:content",
                "scope:services",
                "scope:platform",
                "scope:shared",
                "scope:core"
              ]
            },
            // Scope dimension: business domains are isolated from one another and
            // from platform capabilities. Shared/core are the only cross-domain seams.
            {
              sourceTag: "scope:commerce",
              onlyDependOnLibsWithTags: ["scope:commerce", "scope:shared", "scope:core"]
            },
            {
              sourceTag: "scope:content",
              onlyDependOnLibsWithTags: ["scope:content", "scope:shared", "scope:core"]
            },
            {
              sourceTag: "scope:services",
              onlyDependOnLibsWithTags: ["scope:services", "scope:shared", "scope:core"]
            },
            {
              sourceTag: "scope:platform",
              onlyDependOnLibsWithTags: ["scope:platform", "scope:core"]
            },
            {
              sourceTag: "scope:shared",
              onlyDependOnLibsWithTags: ["scope:shared", "scope:core"]
            },
            {
              sourceTag: "scope:core",
              onlyDependOnLibsWithTags: ["scope:core"]
            },

            // Type dimension: domains may cross only through contracts/core.
            // The scope dimension separately permits same-domain dependencies.
            {
              sourceTag: "type:app",
              onlyDependOnLibsWithTags: [
                "type:domain",
                "type:ui",
                "type:platform",
                "type:contract",
                "type:util"
              ]
            },
            {
              sourceTag: "type:domain",
              onlyDependOnLibsWithTags: ["type:contract", "type:util"]
            },
            {
              sourceTag: "type:ui",
              onlyDependOnLibsWithTags: ["type:ui", "type:util"]
            },
            {
              sourceTag: "type:platform",
              onlyDependOnLibsWithTags: ["type:platform", "type:contract", "type:util"]
            },
            {
              sourceTag: "type:contract",
              onlyDependOnLibsWithTags: ["type:util"]
            },
            {
              sourceTag: "type:util",
              onlyDependOnLibsWithTags: ["type:util"]
            }
          ]
        }
      ]
    }
  }
];
