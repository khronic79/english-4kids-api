import {Router} from 'express';
import { createCategory, createWordInCategory, deleteCategory, deleteWordInCategory, getCategories, getCategoryById, getWordsByCategory, updateCategory, updateWordInCategory } from './methods';

interface Word {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
}

export const router = Router();

router.get('/', async (req, res) => {
  const categories = await getCategories();
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const catId = +req.params.id;
  if (!catId) {
    return res.sendStatus(400);
  }
  try {
    const cat = await getCategoryById(catId);
    res.json(cat);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete('/:id', async (req, res) => {
  const categoryId = Number(req.params.id);
  console.log('deleted', categoryId);
  if (!categoryId) {
    return res.sendStatus(400);
  }
  try {
    await deleteCategory(categoryId);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/', async (req, res) => {
  const data = req.body as {category: string};
  if (!data.category) {
    return res.sendStatus(400);
  }
  try {
    const newCategories = await createCategory(data.category);
    return res.json(newCategories)
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.put('/:id', async (req, res) => {
  const catId = +req.params.id;
  console.log('UPD1',catId);
  if (!catId) {
    return res.sendStatus(400);
  }
  console.log('req', req);
  const data = req.body as {category: string};
  console.log('UPD2', data);
  if (!data.category) {
    return res.sendStatus(400);
  }
  try {
    const newCategories = await updateCategory(catId, data.category);
    return res.json(newCategories)
  } catch (e) {
    return res.status(400).send(e);
  }
})

router.get('/category/:id', async (req, res) => {
  const catId = +req.params.id;
  if (!catId) {
    return res.sendStatus(400);
  }
  const catWords = await getWordsByCategory(catId);
  if (!catWords) {
    return res.sendStatus(404);
  }
  res.json(catWords);
});

router.post('/category/:id', async (req, res) => {
  const catId = +req.params.id;
  console.log('New word', catId);
  if (!catId) {
    return res.sendStatus(400);
  }
  const data = req.body as Word;
  console.log('New word1', data);
  if (!data.word) {
    res.sendStatus(400);
  }
  try {
    const newWords = await createWordInCategory(data.word, data.translation, data.image, data.audioSrc, catId);
    return res.json(newWords);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete('/category/:catId/word/:wordId', async (req, res) =>{
  const catId = +req.params.catId;
  const wordId = +req.params.wordId;
  if (!catId) {
    return res.sendStatus(404);
  }
  if (!wordId) {
    return res.sendStatus(404);
  }
  try {
    const newWords = await deleteWordInCategory(wordId, catId);
    return res.json(newWords);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.put('/category/:catId/word/:wordId', async (req, res) =>{
  const wordId = +req.params.wordId;
  const catId = +req.params.catId;
  if (!catId) {
    return res.sendStatus(400);
  }
  if (!wordId) {
    return res.sendStatus(400);
  }
  const data = req.body as Word;
  if (!data.word) {
    res.sendStatus(400);
  }
  try {
    const newWords = await updateWordInCategory(data.word, data.translation, data.image, data.audioSrc, wordId, catId);
    return res.json(newWords);
  } catch (e) {
    return res.status(400).send(e);
  }
});