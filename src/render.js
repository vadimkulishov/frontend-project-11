const createFeeds = (state) => {
  const feeds = [];
  state.feeds.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    liEl.append(feedTitle);
    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.description;
    liEl.append(pEl);
    feeds.push(liEl);
  });
  return feeds;
};

const createButton = (post, i18next) => {
  const buttonEl = document.createElement('button');
  buttonEl.setAttribute('type', 'button');
  buttonEl.setAttribute('data-id', post.id);
  buttonEl.setAttribute('data-bs-toggle', 'modal');
  buttonEl.setAttribute('data-bs-target', '#modal');
  buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  buttonEl.textContent = i18next.t('buttons.view');
  return buttonEl;
};

const createPosts = (state, i18next) => {
  const posts = [];
  state.posts.forEach((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const aEl = document.createElement('a');
    aEl.setAttribute('href', post.link);
    aEl.setAttribute('data-id', post.id);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'noopener noreferrer');
    if (state.uiState.viewedPostIds.has(post.id)) {
      aEl.classList.add('fw-normal');
    } else {
      aEl.classList.add('fw-bold');
    }
    aEl.textContent = post.title;
    const buttonEl = createButton(post, i18next);
    liEl.append(aEl);
    liEl.append(buttonEl);
    posts.push(liEl);
  });
  return posts;
};

const createList = (itemsType, state, i18next) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  cardBody.append(cardTitle);
  card.append(cardBody);
  cardTitle.textContent = i18next.t(`items.${itemsType}`);
  switch (itemsType) {
    case 'feeds':
      list.append(...createFeeds(state));
      break;
    case 'posts':
      list.append(...createPosts(state, i18next));
      break;
    default:
      break;
  }
  card.append(list);
  return card;
};

const renderInvalid = () => {
  const submit = document.querySelector('[type="submit"]');
  const urlInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  submit.disabled = false;
  urlInput.classList.add('is-invalid');
  feedback.classList.remove('text-success', 'text-warning');
  feedback.classList.add('text-danger');
};

const renderSending = (i18next) => {
  const submit = document.querySelector('[type="submit"]');
  const urlInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  submit.disabled = true;
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger', 'text-success');
  feedback.classList.add('text-warning');
  feedback.textContent = i18next.t('status.sending');
};

const renderAdded = (i18next) => {
  const submit = document.querySelector('[type="submit"]');
  const urlInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');

  submit.disabled = false;
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger', 'text-warning');
  feedback.classList.add('text-success');
  feedback.textContent = i18next.t('status.success');
  form.reset();
  urlInput.focus();
};

const renderState = (i18next, value) => {
  switch (value) {
    case 'invalid':
      renderInvalid();
      break;
    case 'sending':
      renderSending(i18next);
      break;
    case 'added':
      renderAdded(i18next);
      break;
    default:
      break;
  }
};

const renderError = (state, i18next, error) => {
  const feedback = document.querySelector('.feedback');

  if (error === null) {
    return;
  }

  feedback.classList.add('text-danger');
  feedback.textContent = i18next.t(`errors.${state.error}`);
};

const renderFeeds = (state, i18next) => {
  const feedsList = document.querySelector('.feeds');
  feedsList.innerHTML = '';
  const feeds = createList('feeds', state, i18next);
  feedsList.append(feeds);
};

const renderPosts = (state, i18next) => {
  const postsList = document.querySelector('.posts');
  postsList.innerHTML = '';
  const posts = createList('posts', state, i18next);
  postsList.append(posts);
};

const renderDisplayedPost = (state, id) => {
  const modalHeader = document.querySelector('.modal-header');
  const modalBody = document.querySelector('.modal-body');
  const modalHref = document.querySelector('.full-article');

  const posts = state.posts.filter((post) => post.id === id);
  const [{ description, link, title }] = posts;
  modalHeader.textContent = title;
  modalBody.textContent = description;
  modalHref.setAttribute('href', link);
};

const render = (state, _, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(i18next, value);
      break;
    case 'error':
      renderError(state, i18next, value);
      break;
    case 'feeds':
      renderFeeds(state, i18next);
      break;
    case 'posts':
    case 'uiState.viewedPostIds':
      renderPosts(state, i18next);
      break;
    case 'uiState.displayedPost':
      renderDisplayedPost(state, value);
      break;
    default:
      break;
  }
};

export default render;
