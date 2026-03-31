import express from "express";
import { prisma } from "../lib/prisma";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany({ orderBy: { updatedAt: "desc" } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create a note
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update a note
app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const note = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(404).json({ error: "Note not found or failed to update" });
  }
});

// Delete a note
app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.note.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: "Note not found or failed to delete" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
