'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  cloudLink: Handlebars.compile(document.querySelector('#template-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authorcloud-link').innerHTML)
};
function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle', targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
  console.log('targetArticle: ', targetArticle);
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optTagsListSelector = '.tags.list',
  optAuthorsListSelector = '.list.authors';

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log(titleList);

  /* for each article */

  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  );
  console.log(articles);

  /* get the article id */

  let html = '';

  for (let article of articles) {
    /* find the title element */

    const articleId = article.getAttribute('id');
    console.log(articleId);

    /* get the title from the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    // const linkHTML =
    //   '<li><a href="#' +
    //   articleId +
    //   '"><span>' +
    //   articleTitle +
    //   '</span></a></li>';

    /* insert link into titleList */

    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  // console.log(html);
}

generateTitleLinks();

const links = document.querySelectorAll('.titles a');
console.log(links);

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

function calculateTagsParams(tags) {
  const params = { max: 0, min: 999999 };
  for (let tag in tags) {
    console.log(tag + ' is used' + tags[tag] + 'times');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */

  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {
    console.log(article);
    /* find tags wrapper */

    const articleTagsList = article.querySelector(optArticleTagsSelector);
    console.log('articlelist', articleTagsList);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    console.log('tagi', articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log('array', articleTagsArray);

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray) {
      console.log('tagsplit', tag);

      /* generate HTML of the link */

      const linkHTMLData = {id: tag, title: tag};
      const linkHtml = templates.tagLink(linkHTMLData);
      // let linkHtml =
      //   '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';
      // console.log('htmllink', linkHtml);

      /* add generated code to html variable */

      html = html + linkHtml;

      /* [NEW] check if this link is NOT already in allTags */

      // eslint-disable-next-line no-prototype-builtins
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags objects */

        allTags[tag] = 1;
        console.log('allTags', allTags);
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    articleTagsList.innerHTML = html;

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */

  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  // let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags:*/

  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTags */
    const tagLinkHTML = `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}"><span>${tag} (${allTags[tag]})</span></a></li> `;
    // '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    // allTagsHTML += tagLinkHTML;


  }
  /* [NEW] END LOOP for each tag in allTags */

  /* [NEW] add html from allTagsHTML to taglist */
  tagList.innerHTML = templates.cloudLink(allTagsData);
  console.log(allTagsData);
  //tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log('clickedelement', href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  // const href = document.querySelector(href);

  const tag = href.replace('#tag-', '');
  console.log('tag', tag);

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for (let tagLink of activeTagLinks) {
    console.log('linktaga', tagLink);

    /* remove class active */

    tagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinksHref = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for (let tagLinkHref of tagLinksHref) {
    /* add class active */

    tagLinkHref.classList.add('active');

    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */

  const allTagLinks = document.querySelectorAll('[href^="#tag-"]');

  /* START LOOP: for each link */

  for (let link of allTagLinks) {
    console.log(allTagLinks);

    /* add tagClickHandler as event listener for that link */

    link.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {

  let allAuthors = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* for each article: */
  for (let article of articles) {
    /* find author wrapper */

    const authorWrapper = article.querySelector(optArticleAuthorSelector);


    /* make html variable with empty string */

    let html = '';

    /* get author from data-author attribute */

    const author = article.getAttribute('data-author');


    /* generate HTML of the link */

    //const linkHTMLData = {id: 'author-' + author, title: author};

    const linkHTMLData = {id: author, title: author};
    const linkHTML = templates.authorLink(linkHTMLData);
    // const linkHTML =
    // '<li><a href="#author-' +
    // author +
    // '"><span>' +
    // author +
    // '</span></a></li>';

    if(!allAuthors[author]) {

      /* [NEW] add author to allAuthors object */

      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }

    html = html + linkHTML;

    /* insert HTML of author-name into the author wrapper */

    authorWrapper.innerHTML = html;

    /* END LOOP: for each article */
  }

  /* [NEW] find list of author in right column */

  const authorList = document.querySelector(optAuthorsListSelector);
  console.log(authorList);

  /* [NEW] create variable for all links HTML code */

   const allAuthorsData = {authors: []};

  /* [NEW] START LOOP: for each author in allAuthors: */


// let allAuthorsHtml = '';

  for(let author in allAuthors){

    /* [NEW] generate code of a link and add it to allAuthorsHTML */


    const authorLinkHTML = `<li><a href="#author-${author}">${author}</a>(${allAuthors[author]})</li>`;

    allAuthorsData.authors.push({
      author:author,
      count: allAuthors[author],
      
    });

    // allAuthorsHtml += authorLinkHtml;

  /* [NEW] END LOOP: for each author in allAuthors: */
  }

  /*[NEW] add HTML from allAuthorsHTML to authorList */

// authorList.innerHTML = allAuthorsHtml;
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  // console.log('allAuthorsData', allAuthorsData);
}

generateAuthors();

function addClickListenersToAuthors() {
  //   /* find all links to authorss */

  const allAuthorLinks = document.querySelectorAll('[href^="#author-"]');

  //   /* START LOOP: for each link */

  for (let link of allAuthorLinks) {
    console.log(allAuthorLinks);

    //    /* add tagClickHandler as event listener for that link */

    link.addEventListener('click', authorClickHandler);

    //     /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();

function authorClickHandler(event) {
  //   /* prevent default action for this event */

  event.preventDefault();

  //   /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  //   /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log('clickedelement', href);

  const authorName = href.replace('#author-', '');

  //   /* find all tag links with class active */

  const activeAuthorLinks = document.querySelectorAll(
    'a.active[href^="#author-"]'
  );

  //   /* START LOOP: for each active tag link */

  for (let authorLink of activeAuthorLinks) {
    console.log('linktaga', authorLink);

    //     /* remove class active */

    authorLink.classList.remove('active');

    //     /* END LOOP: for each active tag link */
  }

  //   /* find all tag links with "href" attribute equal to the "href" constant */

  const authorLinksHref = document.querySelectorAll('a[href="' + href + '"]');

  for (let authorLinkHref of authorLinksHref) {
    authorLinkHref.classList.add('active');
  }

  //   /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + authorName + '"]');
}
