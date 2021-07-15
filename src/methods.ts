import {db} from './db';

interface Category {
  id: number;
  categoryName: string;
}

interface Words {
  catId: number;
  words: Word[];
};

interface Word {
  id: number;
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
}

interface User {
  login: string;
  password: string
}

const categories = db.categories;
const catCounter = (function() {
  let id = categories.length;
  return () => ++id;
}) ();

const words = db.words;
const wordsCounters = words.map(words => {
  let counter = (function() {
    let id = words.words.length;
    return () => ++id;
  })();
  let catId = words.catId;
  return {
    counter,
    catId
  }; 
});

const users = db.users;


export function getCategories(): Promise<Category[]> {
  return Promise.resolve(categories); 
}

export function getCategoryById(id: number): Promise<Category> | undefined {
  const catId = categories.findIndex(elem => elem.id === id);
  console.log(catId);
  if (catId < 0) {
    return Promise.reject(`Category with ID ${id} does not exist`);
  }
  return Promise.resolve(categories[catId]);
}

export function deleteCategory(id: number): Promise<Category[]> {
  const catId = categories.findIndex(cat => cat.id === id);
  if (catId < 0) {
    return Promise.reject(`Category with ID ${id} does not exist`);
  }
  categories.splice(catId, 1);
  const wordsId = words.findIndex(words => words.catId === id);
  words.splice(wordsId, 1);
  const counterId = wordsCounters.findIndex(counter => counter.catId === id);
  wordsCounters.splice(counterId, 1);
  return Promise.resolve(categories);
}

export function createCategory(category: string): Promise<Category[]> {
  const isExit = categories.findIndex((cat) => cat.categoryName === category);
  if (isExit>=0) {
    return Promise.reject(`Category with name ${category} already exists`);
  }
  const newCatId = catCounter();
  categories.push({
    id: newCatId,
    categoryName: category
  });
  words.push({
    catId: newCatId,
    words: []
  });
  return Promise.resolve(categories);
}

export function updateCategory(catIt: number, newCategory: string): Promise<Category[]> {
  const isExit = categories.findIndex((cat) => cat.id === catIt); 
  if (isExit<0) {
    return Promise.reject(`Category with Id ${catIt} does not exist`);
  }
  categories[isExit].categoryName = newCategory;
  return Promise.resolve(categories);
}

export function getWordsByCategory(categoryId: number): Promise<Words> {
  const index = words.findIndex((words) => words.catId === categoryId);
  if (index < 0) {
    return Promise.reject(`Category with ID ${categoryId} does not exist`);
  }
  return Promise.resolve(words[index]);
}

export function createWordInCategory(word: string,  translation: string, image: string, audioSrc: string, categoryId: number): Promise<Word[]> {
  const index = words.findIndex((words) => words.catId === categoryId);
  if (index < 0) {
    return Promise.reject(`Category with ID ${categoryId} does not exist`);
  }
  const wordInd = words[index].words.findIndex((item) => item.word === word);
  if (wordInd >= 0) {
    return Promise.reject(`Word ${word} already exists in category ${categories[categoryId]}`);
  }
  const counterIndex = wordsCounters.findIndex((counter) => counter.catId === categoryId);
  const newIndex = wordsCounters[counterIndex].counter();
  words[index].words.push({
    id: newIndex,
    word,
    translation,
    image,
    audioSrc
  });
  return Promise.resolve(words[index].words);
}

export function deleteWordInCategory(wordId: number, categoryId: number): Promise<Word[]> {
  const index = words.findIndex((words) => words.catId === categoryId);
  if (index < 0) {
    return Promise.reject(`Category with ID ${categoryId} does not exist`);
  }
  const wordIndex = words[index].words.findIndex(word => word.id === wordId);
  if (wordIndex < 0) {
    return Promise.reject(`Word with Id ${wordId} does not exists in category ID ${categoryId}`);
  }
  words[index].words.splice(wordIndex,1);
  return Promise.resolve(words[index].words);
}

export function updateWordInCategory(word: string, translation: string, image: string, audioSrc: string, wordId: number, categoryId: number): Promise<Word[]> {
  const indexCat = words.findIndex((words) => words.catId === categoryId);
  if (indexCat < 0) {
    return Promise.reject(`Category with ID ${categoryId} does not exist`);
  }
  const indexWord = words[indexCat].words.findIndex((word) => word.id === wordId);
  
  if (indexWord < 0) {
    return Promise.reject(`Words with ID ${wordId} in category ${categories[categoryId]} does not exist`);
  }
  words[indexCat].words[indexWord].word = word;
  words[indexCat].words[indexWord].translation = translation;
  words[indexCat].words[indexWord].image = image;
  words[indexCat].words[indexWord].audioSrc = audioSrc;
  return Promise.resolve(words[indexCat].words);
}

export function userAuth(login: string, password: string): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.login === login);
  if (userIndex < 0) {
    return Promise.reject(`User with login ${login} does not exist`);
  }
  if (users[userIndex].login !== password) {
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
}
