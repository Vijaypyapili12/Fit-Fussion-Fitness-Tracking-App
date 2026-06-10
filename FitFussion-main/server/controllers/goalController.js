import Goal from "../models/Goal.js";

// @desc    Create a new goal bound to logged-in user
// @route   POST /api/goals
export const createGoal = async (req, res) => {
  try {
    let { type, target, targetLeft, completed } = req.body;

    const targetVal = Number(target) || 0;
    const leftVal = Number(targetLeft) || 0;

    if (leftVal > targetVal) {
      return res.status(400).json({ success: false, message: "`targetLeft` cannot be greater than `target`." });
    }

    const progress = targetVal - leftVal;
    const percentage = targetVal > 0 ? (progress / targetVal) * 100 : 0;

    if (percentage >= 100 || completed === true) {
      completed = true;
      targetLeft = 0;
    }

    const newGoal = new Goal({ 
      user: req.user._id, // Separates ownership
      type, 
      target: targetVal, 
      targetLeft: Number(targetLeft), 
      completed 
    });
    
    await newGoal.save();
    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get only the logged-in user's goals
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    // Only query goals matching this specific user's ID
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Add progress toward an outstanding goal milestone / Handle adjustments
// @route   PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    // Safety Lockout: Prevent user2 from altering user1's training targets
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized to update this record." });
    }

    // INTERCEPT CHECK: Is this an incremental progress entry?
    if (req.body.progressMade !== undefined) {
      const amountToDeduct = Number(req.body.progressMade) || 0;
      
      // Deduct progress from outstanding amount left without slipping into negative numbers
      goal.targetLeft = Math.max(0, goal.targetLeft - amountToDeduct);

      // If target remaining drops to 0, toggle the milestone completion status flags
      if (goal.targetLeft === 0) {
        goal.completed = true;
      }

      await goal.save();
      return res.status(200).json({ success: true, data: goal });
    }

    // FALLBACK CHANNELS: Handles your standard "Mark as Complete" button triggers
    let { target, targetLeft, completed } = req.body;
    let targetVal = target !== undefined ? Number(target) : goal.target;
    let leftVal = targetLeft !== undefined ? Number(targetLeft) : goal.targetLeft;

    if (completed === true) {
      leftVal = 0;
    }

    if (leftVal > targetVal) {
      return res.status(400).json({ success: false, message: "`targetLeft` cannot be greater than `target`." });
    }

    const progress = targetVal - leftVal;
    const percentage = targetVal > 0 ? (progress / targetVal) * 100 : 0;

    if (percentage >= 100) {
      completed = true;
      leftVal = 0;
    }

    goal.target = targetVal;
    goal.targetLeft = leftVal;
    goal.completed = completed ?? goal.completed;

    await goal.save();
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete goal with an ownership safeguard check
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    // Safety Lockout
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized to delete this record." });
    }

    await goal.deleteOne();
    res.status(200).json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};