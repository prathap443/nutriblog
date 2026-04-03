import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function BlogDetailScreen({ route }) {
  const { blogId } = route.params;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://YOUR_BACKEND_URL/blogs/${blogId}`)
      .then(res => res.json())
      .then(data => setBlog(data));
  }, []);

  if (!blog) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{blog.title}</Text>
      <Text>{blog.date} • {blog.author}</Text>
      <Text>{blog.content}</Text>
    </ScrollView>
  );
}
