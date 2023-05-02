import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const entryRouter = express.Router();
entryRouter.use(express.json());

/**
 * Get all data entries
 */
entryRouter.get("/", async (_req, res) => {
  try {
    const entrys = await collections.entrys.find({}).toArray();
    res.status(200).send(entrys);
    // res.status(200).send("Hello!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Get data entry by id
 */
entryRouter.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const entry = await collections.entrys.findOne(query);

    if (entry) {
      res.status(200).send(entry);
    } else {
      res.status(404).send(`Failed to find an entry: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find an entry: ID ${req?.params?.id}`);
  }
});

/**
 * Create a new data entry
 */
entryRouter.post("/", async (req, res) => {
  try {
    const entry = req.body;
    const result = await collections.entrys.insertOne(entry);

    if (result.acknowledged) {
      res.status(201).send(`Created a new entry: ID ${result.insertedId}.`);
    } else {
      res.status(500).send("Failed to create a new entry.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

/**
 * Update a data entry
 */
entryRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const entry = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.entrys.updateOne(query, {
      $set: entry,
    });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated an entry: ID ${id}.`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find an entry: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update an entry: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

/**
 * Delete a data entry
 */
entryRouter.delete("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.entrys.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed an entry: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove an entry: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find an entry: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
