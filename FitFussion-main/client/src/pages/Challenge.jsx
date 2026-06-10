// client/src/pages/Challenge.jsx
import React, { useState, useEffect } from "react";
import { getChallenges, createChallenge, updateChallenge, deleteChallenge, joinChallengeAPI } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus, FaCheckCircle, FaTrash, FaRunning, FaTrophy, FaLock, FaCreditCard, FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form Field States
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("7");
  const [difficulty, setDifficulty] = useState("Medium");

  // Inline progress entries map
  const [progressInputs, setProgressInputs] = useState({});

  // PAYMENT MODAL SIMULATION VIEW STATES
  const [activePaymentChallenge, setActivePaymentChallenge] = useState(null);
  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");

  const fetchAllChallenges = async () => {
    try {
      const res = await getChallenges();
      setChallenges(res.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching challenges collection:", err);
      setError("Failed to fetch community challenges pool.");
    }
  };

  useEffect(() => {
    fetchAllChallenges();
  }, []);

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!description.trim()) return toast.warn("Please write a challenge description.");

    try {
      setLoading(true);
      await createChallenge({ type: description, duration: Number(duration), difficulty });
      setDescription("");
      fetchAllChallenges();
      toast.success("New Global Community Challenge launched successfully!");
    } catch (err) {
      console.error("Error creating global challenge document:", err);
      toast.error("Failed to push global challenge template.");
    } finally {
      setLoading(false);
    }
  };

  // HANDLES OPENING GATEWAY MODAL
  const openPaymentModal = (challenge) => {
    setActivePaymentChallenge(challenge);
  };

  // CONCLUDES SIMULATED BANKING PIPELINE SECURELY
  const handleProcessPaymentSimulation = async (e) => {
    e.preventDefault();
    if (!activePaymentChallenge) return;

    try {
      setPaying(true);
      // Simulate network processing delay for high realism grade points
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Execute backend join allocation
      await joinChallengeAPI(activePaymentChallenge._id, { paymentAmount: 499 }); // Entry simulation price point fee

      toast.success(`💳 Transaction Approved! You have joined "${activePaymentChallenge.type}"!`);
      setActivePaymentChallenge(null);
      fetchAllChallenges();
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error("Simulated transaction dropped.");
    } finally {
      setPaying(false);
    }
  };

  const handleAddProgress = async (e, challengeId) => {
    e.preventDefault();
    const inputVal = progressInputs[challengeId];
    if (!inputVal || Number(inputVal) <= 0) return toast.warn("Enter a valid day increment greater than 0.");

    try {
      await updateChallenge(challengeId, { additionalDays: Number(inputVal) });
      setProgressInputs({ ...progressInputs, [challengeId]: "" });
      fetchAllChallenges();
      toast.success("Your private milestone progress has been successfully recorded!");
    } catch (err) {
      console.error("Error submitting progress:", err);
      toast.error("Failed to append challenge metrics.");
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm("Are you sure you want to delete this community challenge globally for ALL users?")) return;

    try {
      await deleteChallenge(challengeId);
      fetchAllChallenges();
      toast.success("Challenge template successfully removed.");
    } catch (err) {
      console.error("Error deleting entry:", err);
      toast.error("Failed to purge global resource.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl min-h-[85vh]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent mb-2">
          Manage Your Challenges
        </h1>
        <p className="text-sm italic text-gray-400">"Lock in stakes. Compete together. Achieve goals."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CREATE PANEL BLOCK */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/80">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-700 dark:text-gray-200">Create a New Challenge</h2>
          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Challenge Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Daily 5K running sprint"
                className="w-full px-4 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Duration (Days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none font-medium"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <FaPlus className="text-xs" /> {loading ? "Creating..." : "Create Challenge"}
            </button>
          </form>
        </div>

        {/* TRACKING TIMELINES PANEL LIST */}
        <div className="lg:col-span-2">
          {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
          {challenges.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No active challenges found. Design one on the left to start the pool!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((item) => {
                const percentage = Math.min(100, Math.round((item.daysCompleted / item.duration) * 100));

                return (
                  <div
                    key={item._id}
                    className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between hover:shadow-lg transition duration-200"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                          <FaTrophy className="text-base" />
                        </div>
                        <button
                          onClick={() => handleDeleteChallenge(item._id)}
                          className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg transition"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>

                      <h3 className="text-xl font-bold capitalize text-gray-800 dark:text-gray-100 mb-1">
                        {item.type}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mb-4">
                        Duration: {item.duration} days | Difficulty: <span className="text-purple-500 font-bold">{item.difficulty}</span>
                      </p>

                      {/* DISPLAY PROGRESS BAR ONLY IF JOINED */}
                      {item.hasJoined && (
                        <div className="space-y-1 mb-4">
                          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-gray-400">
                            <span>{item.daysCompleted} / {item.duration} days logged</span>
                            <span>{percentage}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-50 dark:border-gray-700/50 pt-3">
                      {!item.hasJoined ? (
                        /* PREMIUM GATE ACTION KEY BUTTON BUTTON */
                        <button
                          onClick={() => openPaymentModal(item)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <FaLock className="text-[10px]" /> Stake ₹499 & Join Pool
                        </button>
                      ) : item.completed ? (
                        <div className="flex items-center justify-center gap-1.5 text-green-500 font-bold text-sm bg-green-50 dark:bg-green-900/20 py-2 rounded-xl border border-green-100 dark:border-green-900/40">
                          <FaCheckCircle /> Challenge Achieved!
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => handleAddProgress(e, item._id)}
                          className="flex space-x-2"
                        >
                          <input
                            type="number"
                            value={progressInputs[item._id] || ""}
                            onChange={(e) => setProgressInputs({ ...progressInputs, [item._id]: e.target.value })}
                            placeholder="Add completed days..."
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-md whitespace-nowrap"
                          >
                            <FaRunning className="text-[10px]" /> Add Progress
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          THE SIMULATED CREDIT CARD PAYMENT MODAL SCREEN 
          ========================================== */}
      {activePaymentChallenge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 transform scale-100 transition duration-300">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 mb-2">
                <FaCreditCard className="text-xl" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">Secure Simulation Gateway</h2>
              <p className="text-xs text-gray-400 mt-1">
                Staking entry fee for: <span className="font-bold text-gray-600 dark:text-gray-300 capitalize">"{activePaymentChallenge.type}"</span>
              </p>
            </div>

            <form onSubmit={handleProcessPaymentSimulation} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Card Number</label>
                <input
                  type="text"
                  disabled={paying}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-sm font-mono tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    disabled={paying}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-sm text-center font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">CVV Security Code</label>
                  <input
                    type="password"
                    disabled={paying}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-sm text-center font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-500">Total Entry Amount:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base">₹499.00</span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  disabled={paying}
                  onClick={() => setActivePaymentChallenge(null)}
                  className="w-1/2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-bold text-xs py-2.5 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                >
                  {paying ? (
                    <>
                      <FaSpinner className="animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Authorize Payment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenge;