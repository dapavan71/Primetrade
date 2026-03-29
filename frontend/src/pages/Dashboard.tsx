import { useState, useEffect } from 'react';
import api from '../config/api';
import TaskForm from '../components/TaskForm';
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle, CheckSquare } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={20} />;
      case 'IN_PROGRESS': return <Clock className="text-blue-500" size={20} />;
      default: return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Completed</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">In Progress</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">Pending</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user.name} {user.role === 'ADMIN' && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded ml-2">ADMIN</span>}
          </p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      {showForm && (
        <TaskForm 
          initialData={editingTask}
          onSuccess={() => { setShowForm(false); fetchTasks(); }}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg">No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="pt-1">{getStatusIcon(task.status)}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="text-xs text-gray-400 flex gap-4">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {user.role === 'ADMIN' && <span>User: {task.user?.name} ({task.user?.email})</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button 
                    onClick={() => { setEditingTask(task); setShowForm(true); }}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
