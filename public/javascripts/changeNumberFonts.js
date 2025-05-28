function wrapSpecialsAndNumbersInSpan(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];
  
    while ((node = walker.nextNode())) {
      if (/[^\p{L}\s,.]/u.test(node.nodeValue)) {
        nodesToReplace.push(node);
      }
    }
  
    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
  
      // Match non-letters and non-space characters, excluding , and .
      const newHTML = textNode.nodeValue.replace(/([^\p{L}\s,.]+)/gu, '<span class="num">$1</span>');
  
      const temp = document.createElement('span');
      temp.innerHTML = newHTML;
  
      while (temp.firstChild) {
        parent.insertBefore(temp.firstChild, textNode);
      }
      parent.removeChild(textNode);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    wrapSpecialsAndNumbersInSpan(document.body);
  });
  