const Group = require('../models/Group');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Group name and password are required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.groups && user.groups.length >= 5) {
      return res.status(400).json({ message: 'You cannot be associated to more than 5 groups at the moment' });
    }
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group name already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const group = new Group({ name, password: hashedPassword, members: [userId] });
    await group.save();
    user.groups.push(group._id);
    await user.save();
    res.status(201).json({ message: 'Group created and joined', group: { id: group._id, name: group.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Group name and password are required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.groups && user.groups.length >= 5) {
      return res.status(400).json({ message: 'You cannot be associated to more than 5 groups at the moment' });
    }
    const group = await Group.findOne({ name });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const isMember = group.members.some(memberId => memberId.equals(userId));
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }
    const passwordMatch = await bcrypt.compare(password, group.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect group password' });
    }
    group.members.push(userId);
    await group.save();
    user.groups.push(group._id);
    await user.save();
    res.status(200).json({ message: 'Joined group', group: { id: group._id, name: group.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('groups', 'name');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const groups = user.groups.map(g => ({ id: g._id, name: g.name }));
    res.json({ groups });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 