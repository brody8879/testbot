'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Todo List</h1>
        <p className="text-slate-500 mb-8">保持高效，完成任务</p>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 transition-all ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 hover:border-emerald-500'
                }`}
              >
                {todo.completed && <Check className="w-4 h-4" />}
              </button>
              <span
                className={`flex-1 text-slate-700 ${
                  todo.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">暂无任务</p>
              <p className="text-sm">添加你的第一个任务开始吧！</p>
            </div>
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            {todos.filter(t => t.completed).length} / {todos.length} 完成
          </div>
        )}
      </div>
    </div>
  );
}
