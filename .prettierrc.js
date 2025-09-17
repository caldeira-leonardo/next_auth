// Configuração do Prettier - Estilo similar ao do assistente
// Quebra menos linhas e mantém código mais compacto

module.exports = {
  // Aspas simples (mais limpo)
  singleQuote: true,
  jsxSingleQuote: true,

  // Ponto e vírgula (padrão JavaScript)
  semi: true,

  // Vírgula final (mais fácil de adicionar/remover itens)
  trailingComma: 'es5',

  // Largura máxima da linha (120 caracteres - quebra menos)
  printWidth: 120,

  // Indentação com 2 espaços
  tabWidth: 2,
  useTabs: false,

  // Espaçamento em objetos e arrays
  bracketSpacing: true,

  // Quebra de linha em JSX (não coloca > na mesma linha)
  bracketSameLine: false,

  // Parênteses em arrow functions (sempre usar parênteses)
  arrowParens: 'always',

  // Quebra de linha no final do arquivo
  endOfLine: 'lf',

  // Aspas em propriedades de objeto (só quando necessário)
  quoteProps: 'as-needed',

  // Preservar quebras de linha em markdown
  proseWrap: 'preserve',

  // Sensibilidade a espaços em branco em HTML
  htmlWhitespaceSensitivity: 'css',

  // Não inserir pragma no topo dos arquivos
  insertPragma: false,
  requirePragma: false,

  // Formatar todo o arquivo
};
