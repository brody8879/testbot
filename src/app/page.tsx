'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Edit2, X, Search, Filter, Calendar, Flag } from 'lucide-react';

export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date' | 'priority' | 'name';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  category: string;
  createdAt: number;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200'
};

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高'
};

const defaultCategories = ['工作', '个人', '购物', '学习', '其他'];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategories[0]);
  const [showFilters, setShowFilters] = useState(false);

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
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false,
        priority: selectedPriority,
        category: selectedCategory,
        createdAt: Date.now()
      }]);
      setInput('');
      setSelectedPriority('medium');
      setSelectedCategory(defaultCategories[0]);
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

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id: number) => {
    if (editingText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText } : todo
      ));
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 状态过滤
    if (filterType === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filterType === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // 排序
    filtered = [...filtered].sort((a, b) => {
      if (sortType === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortType === 'name') {
        return a.text.localeCompare(b.text);
      } else {
        return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = {};
    todos.forEach(todo => {
      counts[todo.category] = (counts[todo.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Todo List</h1>
          <p className="text-slate-500">
            已完成 {completedCount} / {totalCount} 个任务
          </p>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索任务..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              过滤
            </button>
          </div>

          {/* 过滤选项 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterType === 'all'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilterType('active')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterType === 'active'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  未完成
                </button>
                <button
                  onClick={() => setFilterType('completed')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterType === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  已完成
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-slate-500 text-sm self-center">排序：</span>
                <button
                  onClick={() => setSortType('date')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortType === 'date'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  时间
                </button>
                <button
                  onClick={() => setSortType('priority')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortType === 'priority'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  优先级
                </button>
                <button
                  onClick={() => setSortType('name')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortType === 'name'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  名称
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 添加任务 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
            />

            <div className="flex flex-wrap gap-3 items-center">
              {/* 优先级选择 */}
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="low">低优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="high">高优先级</option>
                </select>
              </div>

              {/* 分类选择 */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {defaultCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={addTodo}
                className="ml-auto px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加
              </button>
            </div>
          </div>
        </div>

        {/* 分类统计 */}
        {Object.keys(categoryCounts).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <span
                key={category}
                className="px-3 py-1.5 bg-white rounded-full text-sm text-slate-600 shadow-sm"
              >
                {category}: {count}
              </span>
            ))}
          </div>
        )}

        {/* 任务列表 */}
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-xl shadow-sm p-4 transition-all ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 完成复选框 */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    todo.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-emerald-500'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-slate-700 ${
                            todo.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => startEdit(todo.id, todo.text)}
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[todo.priority]}`}>
                          {priorityLabels[todo.priority]}
                        </span>
                        <span className="text-xs text-slate-400">
                          {todo.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              {searchTerm ? (
                <p className="text-slate-400">没有找到匹配的任务</p>
              ) : (
                <>
                  <p className="text-lg text-slate-400 mb-2">暂无任务</p>
                  <p className="text-sm text-slate-300">添加你的第一个任务开始吧！</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
