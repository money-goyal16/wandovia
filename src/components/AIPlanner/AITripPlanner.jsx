import React, { useState } from 'react';
import { Sparkles, Loader2, MapPin, Save } from 'lucide-react';
import { useTravelPlanner } from '../../contexts/TravelPlannerContext';
import { generateItinerary, createTrip } from '../../services/api';
import './AITripPlanner.css';

const AITripPlanner = () => {
  const { actions } = useTravelPlanner();

  const [form, setForm] = useState({
    destination: '',
    country: '',
    days: 3,
    interests: '',
    budgetLevel: 'moderate',
    pace: 'balanced'
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);
    setSaved(false);

    try {
      const result = await generateItinerary(form);
      setItinerary(result);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Could not reach the AI planner backend. Make sure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsTrip = async () => {
    if (!itinerary) return;

    const activities = itinerary.days.flatMap((d) => d.activities || []);
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + Number(form.days || 1));

    const tripPayload = {
      destination: form.destination,
      country: form.country || 'Unknown',
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      description: itinerary.summary,
      budget: 0,
      activities,
      status: 'upcoming',
      aiGenerated: true,
      aiItinerary: itinerary.days
    };

    try {
      // Persist to MongoDB via the backend
      await createTrip(tripPayload);
    } catch (err) {
      // Even if the backend save fails, still add it locally so the user doesn't lose their plan
      console.error('Failed to persist trip to backend:', err.message);
    }

    // Reflect immediately in the Trip Planner view
    actions.addTrip(tripPayload);
    setSaved(true);
  };

  return (
    <div className="ai-planner fade-in">
      <div className="ai-planner-header">
        <div>
          <h1 className="page-title">
            <Sparkles size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            AI Trip Planner
          </h1>
          <p className="page-subtitle">
            Describe your trip and get an instant day-by-day itinerary, powered by Claude.
          </p>
        </div>
      </div>

      <div className="ai-planner-layout">
        <form className="ai-planner-form" onSubmit={handleGenerate}>
          <div className="form-group">
            <label className="form-label">Destination</label>
            <input
              className="form-input"
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g., Jaipur, Kyoto, Lisbon"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country (optional)</label>
            <input
              className="form-input"
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="e.g., India"
            />
          </div>

          <div className="ai-planner-form-row">
            <div className="form-group">
              <label className="form-label">Number of days</label>
              <input
                className="form-input"
                type="number"
                name="days"
                min="1"
                max="14"
                value={form.days}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Budget level</label>
              <select className="form-input" name="budgetLevel" value={form.budgetLevel} onChange={handleChange}>
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interests</label>
            <input
              className="form-input"
              type="text"
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="e.g., food, history, hiking, nightlife"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pace</label>
            <select className="form-input" name="pace" value={form.pace} onChange={handleChange}>
              <option value="relaxed">Relaxed</option>
              <option value="balanced">Balanced</option>
              <option value="packed">Packed</option>
            </select>
          </div>

          <button className="btn btn-primary ai-generate-btn" type="submit" disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </form>

        <div className="ai-itinerary-result">
          {error && <div className="ai-error-banner">{error}</div>}

          {!itinerary && !error && (
            <div className="ai-empty-hint">
              <MapPin size={48} color="var(--color-gray-400)" />
              <p>Fill in the form and generate your first AI itinerary.</p>
            </div>
          )}

          {itinerary && (
            <>
              <p className="ai-itinerary-summary">{itinerary.summary}</p>

              {itinerary.days.map((day) => (
                <div className="ai-day-card" key={day.day}>
                  <h4>
                    Day {day.day}: {day.title}
                  </h4>
                  <ul>
                    {day.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="ai-planner-actions">
                <button className="btn btn-primary" onClick={handleSaveAsTrip} disabled={saved}>
                  <Save size={18} />
                  {saved ? 'Saved to Trip Planner' : 'Save as Trip'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITripPlanner;
