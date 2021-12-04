'use strict';

function titleClickHandler(event){
event.preventDefault();
const clickedElement = this;
  console.log('Link was clicked!');

  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

for(let activeLink of activeLinks){
  activeLink.classList.remove('active');
}

  /* add class 'active' to the clicked link */

  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute("href");
  console.log("articleSelector", articleSelector)


  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log("targetArticle", targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
  console.log("targetArticle: ", targetArticle);
}




const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(){

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log(titleList)

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles)

    /* get the article id */

    let html = "";

    for(let article of articles){
   
      

    /* find the title element */

    const articleId = article.getAttribute("id");
    console.log(articleId);

    /* get the title from the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log( linkHTML);

    /* insert link into titleList */

    html = html + linkHTML;
    }
    titleList.innerHTML = html;
    console.log(html);
}

generateTitleLinks()
  const links = document.querySelectorAll('.titles a');
console.log(links)

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}