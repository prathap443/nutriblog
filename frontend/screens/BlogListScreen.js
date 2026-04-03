import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function BlogListScreen({ navigation }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('http://YOUR_BACKEND_URL/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BlogDetail', { blogId: item.id })}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.excerpt}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
