import React, { useEffect } from 'react';

// Script para atualizar todas as cores do site
function UpdateColors() {
  useEffect(() => {
    // Seleciona todos os elementos com a cor verde antiga
    const updateColors = () => {
      // Lista de seletores CSS para atualizar
      const selectors = [
        // Botões e links
        'a[style*="#66bb6a"]',
        'button[style*="#66bb6a"]',
        // Backgrounds
        '[style*="background-color: #66bb6a"]',
        '[style*="backgroundColor: #66bb6a"]',
        // Textos e bordas
        '[style*="color: #66bb6a"]',
        '[style*="borderColor: #66bb6a"]',
        // Classes específicas do Material-UI
        '.MuiButton-containedPrimary',
        '.MuiButton-outlinedPrimary',
        '.MuiSwitch-colorPrimary',
        '.MuiCheckbox-colorPrimary',
        '.MuiRadio-colorPrimary',
        '.MuiSlider-colorPrimary'
      ];

      // Nova cor
      const newColor = '#008080';
      const newHoverColor = '#006666';

      // Atualiza as cores
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Atualiza estilos inline
          if (el.style.color === '#66bb6a') el.style.color = newColor;
          if (el.style.backgroundColor === '#66bb6a') el.style.backgroundColor = newColor;
          if (el.style.borderColor === '#66bb6a') el.style.borderColor = newColor;
          
          // Adiciona regras CSS para hover
          const style = document.createElement('style');
          style.innerHTML = `
            ${selector}:hover { 
              background-color: ${newHoverColor} !important; 
              color: white !important; 
            }
          `;
          document.head.appendChild(style);
        });
      });

      // Atualiza também as referências a #e8f5e9 (cor de fundo clara)
      const lightBgSelectors = [
        '[style*="background-color: #e8f5e9"]',
        '[style*="backgroundColor: #e8f5e9"]',
        '[style*="bgcolor: #e8f5e9"]'
      ];
      
      const newLightBg = '#e0f2f2'; // Versão clara do verde água
      
      lightBgSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.style.backgroundColor === '#e8f5e9') el.style.backgroundColor = newLightBg;
        });
      });
    };

    // Executa a atualização de cores
    updateColors();

    // Adiciona um observador para atualizar cores em elementos dinâmicos
    const observer = new MutationObserver(updateColors);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null; // Este componente não renderiza nada visualmente
}

export default UpdateColors;