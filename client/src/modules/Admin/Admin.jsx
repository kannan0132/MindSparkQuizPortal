import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: 'general', // Default to 'general'
    difficulty: 'medium',
    points: 10,
    timeLimit: 30
  });
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const handleAuth = () => {
    if (adminKey === 'admin123' || adminKey === process.env.REACT_APP_ADMIN_KEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminKey', adminKey);
    } else {
      alert('Invalid admin key');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
      console.log(`Loaded ${response.data.length} questions`);
    } catch (error) {
      console.error('Error fetching questions:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to fetch questions: ${errorMsg}\n\nMake sure the server is running on port 3000.`);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/analytics', {
        headers: { 'x-admin-key': adminKey || sessionStorage.getItem('adminKey') }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to fetch analytics. Make sure the server is running.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!formData.question.trim()) {
        alert('Please enter a question');
        return;
      }

      if (formData.options.some(opt => !opt.trim())) {
        alert('Please fill in all options');
        return;
      }

      if (!formData.correctAnswer || !formData.correctAnswer.trim()) {
        alert('Please select a correct answer');
        return;
      }

      // Check if correct answer is in options
      if (!formData.options.includes(formData.correctAnswer)) {
        alert('Correct answer must match one of the options');
        return;
      }

      const headers = { 'x-admin-key': adminKey || sessionStorage.getItem('adminKey') };

      const questionData = {
        question: formData.question.trim(),
        options: formData.options.map(opt => opt.trim()),
        correctAnswer: formData.correctAnswer.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        points: parseInt(formData.points) || 10,
        timeLimit: parseInt(formData.timeLimit) || 30
      };

      let response;
      if (editingQuestion) {
        response = await axios.put(
          `/api/admin/questions/${editingQuestion._id}`,
          questionData,
          { headers }
        );
        alert('Question updated successfully!');
      } else {
        response = await axios.post(
          '/api/admin/questions',
          questionData,
          { headers }
        );
        alert('Question added successfully!');
      }

      setShowAddForm(false);
      setEditingQuestion(null);
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        category: 'general',
        difficulty: 'medium',
        points: 10,
        timeLimit: 30
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save question';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty,
      points: question.points,
      timeLimit: question.timeLimit
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`/api/admin/questions/${id}`, {
        headers: { 'x-admin-key': adminKey || sessionStorage.getItem('adminKey') }
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question. Make sure the server is running.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-auth">
          <div className="auth-card">
            <h1>Admin Login</h1>
            <input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            />
            <button onClick={handleAuth}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>

        {analytics && (
          <div className="analytics-section">
            <h2>Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-value">{analytics.totalQuestions}</div>
                <div className="analytics-label">Total Questions</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analytics.totalGames}</div>
                <div className="analytics-label">Total Games</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analytics.activeRooms}</div>
                <div className="analytics-label">Active Rooms</div>
              </div>
            </div>
          </div>
        )}

        <div className="questions-section">
          <div className="section-header">
            <h2>Questions</h2>
            <button onClick={() => {
              setShowAddForm(true);
              setEditingQuestion(null);
              setFormData({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                category: 'general',
                difficulty: 'medium',
                points: 10,
                timeLimit: 30
              });
            }}>
              Add Question
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="question-form">
              <input
                type="text"
                placeholder="Question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />

              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = e.target.value;
                    // Clear correct answer if it no longer matches
                    let newCorrectAnswer = formData.correctAnswer;
                    if (newCorrectAnswer && !newOptions.includes(newCorrectAnswer)) {
                      newCorrectAnswer = '';
                    }
                    setFormData({ ...formData, options: newOptions, correctAnswer: newCorrectAnswer });
                  }}
                  required
                />
              ))}

              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                required
              >
                <option value="">Select correct answer</option>
                {formData.options.filter(opt => opt.trim()).map((option, index) => (
                  <option key={index} value={option}>
                    {String.fromCharCode(65 + index)}: {option}
                  </option>
                ))}
              </select>
              {formData.correctAnswer && !formData.options.includes(formData.correctAnswer) && (
                <p style={{ color: '#ffffff', fontSize: '0.9rem', marginTop: '5px' }}>
                  ⚠️ Warning: Selected answer doesn't match any option. Please update options or select a different answer.
                </p>
              )}

              <div className="form-row">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="sports">Sports</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="astronomy">Astronomy</option>
                </select>

                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <input
                  type="number"
                  placeholder="Points"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  min="1"
                />

                <input
                  type="number"
                  placeholder="Time Limit (seconds)"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                  min="5"
                />
              </div>

              <div className="form-actions">
                <button type="submit">{editingQuestion ? 'Update' : 'Add'} Question</button>
                <button type="button" onClick={() => {
                  setShowAddForm(false);
                  setEditingQuestion(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="questions-list">
            {questions.map((question) => (
              <div key={question._id} className="question-card">
                <div className="question-header">
                  <h3>{question.question}</h3>
                  <div className="question-meta">
                    <span className="badge">{question.category}</span>
                    <span className="badge">{question.difficulty}</span>
                    <span className="badge">{question.points} pts</span>
                  </div>
                </div>
                <div className="question-options">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`option ${option === question.correctAnswer ? 'correct' : ''}`}
                    >
                      {String.fromCharCode(65 + index)}: {option}
                    </div>
                  ))}
                </div>
                <div className="question-actions">
                  <button onClick={() => handleEdit(question)}>Edit</button>
                  <button onClick={() => handleDelete(question._id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;

