const pool = require('../config/database');

exports.entry = async (req, res) => {
  const { medicine_id, quantity } = req.body;

  await pool.query('BEGIN');

  try {
    const med = await pool.query(
      `SELECT * FROM medicines WHERE id = $1 AND user_id = $2`,
      [medicine_id, req.user.id]
    );

    if (!med.rows.length)
      return res.status(404).json({ error: "Medicamento não encontrado" });

    await pool.query(
      `UPDATE medicines
       SET current_stock = current_stock + $1
       WHERE id = $2`,
      [quantity, medicine_id]
    );

    await pool.query(
      `INSERT INTO stock_movements
       (medicine_id, quantity, movement_type)
       VALUES ($1, $2, 'entry')`,
      [medicine_id, quantity]
    );

    await pool.query('COMMIT');

    res.json({ message: "Entrada registrada" });

  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};

exports.exit = async (req, res) => {
  const { medicine_id, quantity } = req.body;

  await pool.query('BEGIN');

  try {
    const med = await pool.query(
      `SELECT * FROM medicines WHERE id = $1 AND user_id = $2`,
      [medicine_id, req.user.id]
    );

    if (!med.rows.length)
      return res.status(404).json({ error: "Medicamento não encontrado" });

    if (med.rows[0].current_stock < quantity)
      return res.status(400).json({ error: "Estoque insuficiente" });

    await pool.query(
      `UPDATE medicines
       SET current_stock = current_stock - $1
       WHERE id = $2`,
      [quantity, medicine_id]
    );

    await pool.query(
      `INSERT INTO stock_movements
       (medicine_id, quantity, movement_type)
       VALUES ($1, $2, 'exit')`,
      [medicine_id, quantity]
    );

    await pool.query('COMMIT');

    res.json({ message: "Saída registrada" });

  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};