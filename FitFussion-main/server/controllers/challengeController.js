import Challenge from "../models/Challenge.js";
import UserChallenge from "../models/UserChallenge.js";

// @desc    Create a new challenge visible to all community accounts
// @route   POST /api/challenges
export const createChallenge = async (req, res) => {
  try {
    const { type, duration, difficulty } = req.body;

    // Validation gatekeeper check
    if (!type || !duration || !difficulty) {
      return res.status(400).json({ success: false, message: "All form fields are mandatory." });
    }

    const challenge = await Challenge.create({
      type,
      duration: Number(duration),
      difficulty
    });

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    console.error("Error creating public challenge structure:", error);
    res.status(500).json({ success: false, message: "Internal Server Fault Error." });
  }
};

// @desc    Get all communal challenges combined with the logged-in user's isolated progress sheets
// @route   GET /api/challenges
export const getChallenges = async (req, res) => {
  try {
    // 1. Fetch ALL challenges in the collection so every user sees them
    const allChallenges = await Challenge.find({});

    // 2. Fetch only the current logged-in tenant's personal interaction logs
    const userProgress = await UserChallenge.find({ user: req.user._id });

    // 3. Synthesize the collections together for a personalized user view state
    const combinedData = allChallenges.map(challenge => {
      const progress = userProgress.find(p => p.challenge.toString() === challenge._id.toString());
      return {
        _id: challenge._id,
        type: challenge.type,
        duration: challenge.duration,
        difficulty: challenge.difficulty,
        daysCompleted: progress ? progress.daysCompleted : 0,
        hasJoined: !!progress,
        completed: progress ? progress.completed : false,
        progressId: progress ? progress._id : null
      };
    });

    res.status(200).json({ success: true, data: combinedData });
  } catch (error) {
    console.error("Error building integrated challenges view:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// @desc    Increment the logged-in user's tracking milestone inside a shared challenge
// @route   PUT /api/challenges/:id
export const updateChallengeProgress = async (req, res) => {
  try {
    const { id } = req.params; // Challenge Template Base ObjectId Reference ID
    const { additionalDays } = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Global challenge blueprint not found." });
    }

    // Lookup or lazily initialize an isolated progress card row if they haven't interacted yet
    let progress = await UserChallenge.findOne({ user: req.user._id, challenge: id });
    
    if (!progress) {
      progress = new UserChallenge({
        user: req.user._id,
        challenge: id,
        daysCompleted: 0
      });
    }

    const stepsToAdd = Number(additionalDays) || 1;
    progress.daysCompleted = Math.min(challenge.duration, progress.daysCompleted + stepsToAdd);

    if (progress.daysCompleted === challenge.duration) {
      progress.completed = true;
    }

    await progress.save();
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    console.error("Error adjusting custom user challenge progress metrics:", error);
    res.status(500).json({ success: false, message: "Server Error." });
  }
};

// @desc    Purge a challenge template along with its user mapping rows cascadingly
// @route   DELETE /api/challenges/:id
export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Target document not found." });
    }

    // Cascade delete: cleans up any dependencies inside our sub-bridge sheets
    await UserChallenge.deleteMany({ challenge: id });
    await challenge.deleteOne();

    res.status(200).json({ success: true, message: "Global challenge template successfully dropped." });
  } catch (error) {
    console.error("Error deleting global challenge record:", error);
    res.status(500).json({ success: false, message: "Server encountered a database drop error." });
  }
};

// @desc    Simulate payment gateway confirmation and join a global challenge
// @route   POST /api/challenges/:id/join
export const joinChallengeWithPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentAmount } = req.body; // e.g., 500 INR Entry Stake

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge blueprint not found." });
    }

    // Check if the user is already enrolled
    const existingRegistration = await UserChallenge.findOne({ user: req.user._id, challenge: id });
    if (existingRegistration) {
      return res.status(400).json({ success: false, message: "You have already joined this challenge pool." });
    }

    // SIMULATION ENGINE GATEWAY: Assumes payment goes through successfully
    const newProgressRow = new UserChallenge({
      user: req.user._id,
      challenge: id,
      daysCompleted: 0,
      stakedAmount: Number(paymentAmount) || 0
    });

    await newProgressRow.save();
    res.status(201).json({ success: true, message: "Simulated payment captured!", data: newProgressRow });
  } catch (error) {
    console.error("Error in transaction simulation pipeline:", error);
    res.status(500).json({ success: false, message: "Server Gateway simulation fault." });
  }
};