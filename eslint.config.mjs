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
      "@nx/enforce-module-boundaries": [
        "error",
        {
          allow: [],
          depConstraints: [
            { sourceTag: "scope:storefront", onlyDependOnLibsWithTags: ["scope:storefront", "scope:commerce", "scope:content", "scope:services", "scope:seo", "scope:analytics", "scope:schemas", "scope:ui"] },\n            { sourceTag: "scope:commerce", onlyDependOnLibsWithTags: ["scope:commerce", "scope:seo", "scope:analytics", "scope:schemas", "scope:ui"] },\n            { sourceTag: "scope:content", onlyDependOnLibsWithTags: ["scope:content", "scope:seo", "scope:analytics", "scope:schemas", "scope:ui"] },\n            { sourceTag: "scope:services", onlyDependOnLibsWithTags: ["scope:services", "scope:seo", "scope:analytics", "scope:schemas", "scope:ui"] },\n            { sourceTag: "scope:seo", onlyDependOnLibsWithTags: ["scope:seo", "scope:schemas", "scope:ui"] },\n            { sourceTag: "scope:analytics", onlyDependOnLibsWithTags: ["scope:analytics", "scope:schemas"] },\n            { sourceTag: "scope:schemas", onlyDependOnLibsWithTags: ["scope:schemas"] },\n            { sourceTag: "scope:ui", onlyDependOnLibsWithTags: ["scope:ui"] },
            { sourceTag: "type:app", onlyDependOnLibsWithTags: ["type:domain", "type:platform"] },
            { sourceTag: "type:domain", onlyDependOnLibsWithTags: ["type:domain", "type:platform"] },
            { sourceTag: "type:platform", onlyDependOnLibsWithTags: ["type:platform"] },
          ],
        },
      ],
    },
  },
];
