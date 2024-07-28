import mongoose from 'mongoose';

const sequenceSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

export default Sequence;
