import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import-x";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // .next 빌드 디렉토리 무시
  { ignores: [".next/**"] },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // import 정렬 및 검사
  {
    plugins: {
      "import-x": importPlugin,
    },
    rules: {
      // import 정렬: 그룹별 자동 정렬
      "import-x/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      // 중복 import 방지
      "import-x/no-duplicates": "warn",
    },
  },

  // Prettier와 충돌하는 ESLint 룰 비활성화 (반드시 마지막에 위치)
  ...compat.extends("prettier"),
];

export default eslintConfig;
