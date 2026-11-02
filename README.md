# Manga & Comic Translator

Versão inicial web para reconhecer texto em imagens de mangá/quadrinhos (OCR) e traduzir o texto reconhecido.

## Como usar
1. Abra `index.html` em um navegador moderno ou publique o repositório com GitHub Pages.
2. Escolha uma imagem.
3. Selecione o idioma original e o idioma de destino.
4. Toque em **Reconhecer e traduzir**.

## Tecnologias
- Tesseract.js para OCR no navegador.
- API MyMemory para tradução de texto.

## Limitações
- Esta versão traduz o texto reconhecido em uma área separada; ainda não apaga o texto original nem escreve a tradução dentro dos balões.
- A qualidade do OCR depende da imagem e do idioma.
- A tradução usa um serviço externo gratuito, sujeito a limites e disponibilidade.
- É necessária conexão com a internet para carregar as bibliotecas e traduzir.

## Próximas etapas
- Melhorar a detecção de balões e a ordem de leitura.
- Permitir correção manual do OCR.
- Inserir a tradução na própria imagem.
- Criar uma versão Android.
