import connectDB from "../../../utils/connectDB";
import Post from "../../../models/Post";
import { sanitizePost } from "../../../utils/sanitizePost";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    // Cap limit to keep responses small and fast (default 2, max 3)
    const limit = Math.min(parseInt(req.query.limit, 10) || 2, 3);

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("name postType isPublished sortOrder content createdAt updatedAt")
        .lean(),
      Post.countDocuments({ isPublished: true })
    ]);
    const sanitized = posts.map(sanitizePost);
    res.status(200).json({ success: true, data: sanitized, total, page, limit });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}