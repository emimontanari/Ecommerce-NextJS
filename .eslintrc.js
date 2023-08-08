module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    project: "./tsconfig.json", // Ruta a tu archivo tsconfig.json
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "airbnb-base", // Usa las reglas de estilo de Airbnb
    "plugin:@typescript-eslint/recommended", // Extiende las reglas de TypeScript recomendadas
  ],
  rules: {
    // Aquí puedes agregar reglas adicionales o anular las reglas existentes según tus necesidades
  },
};
