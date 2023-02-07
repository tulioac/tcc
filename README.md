Esse repositório contém o código utilizado para o TCC (Trabalho de Conclusão de Curso) nomeado **Avaliando o impacto do controle de concorrência do React 18: Um
Estudo de Caso**. 

No artigo, realizou-se uma comparação quantitativa entre dois cenários de uma aplicação React: com e sem as funcionalidades de concorrência da versão 18 da biblioteca React.

Para realização da comparação, criou-se um [teste automatizado](/tests) que simulasse algumas interações com o sistema React escolhido. 
Para esse estudo de caso, utilizou-se o sistema [jira_clone](https://github.com/oldboyxx/jira_clone). 

A partir das interações realizadas, obteve-se linhas [temporais de performance](https://developer.chrome.com/docs/devtools/performance/reference/) que permitiram a análise quantitativa para ambos os cenários.
A comparação evidenciou diversas vantagens do uso do _hook_ [`useDefferedValue`](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue), como: 
- Economia do processamento realizado pelo navegador;
- Redução do tempo necessário para realização de ações;
- Obtenção de um _feedback_ mais rápidos às ações realizadas.
