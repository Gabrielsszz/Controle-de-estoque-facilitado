const pool = require('../config/database');

exports.createMedicine = async (req, res) => {
  const { name, expiration_date, price, current_stock } = req.body;

  const result = await pool.query(
    `INSERT INTO medicines
     (name, expiration_date, price, current_stock, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, expiration_date, price, current_stock, req.user.id]
  );

  res.status(201).json(result.rows[0]);
};

exports.getMedicines = async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM medicines
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [req.user.id]
  );

  res.json(result.rows);
};

exports.deleteMedicine = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    `DELETE FROM medicines
     WHERE id = $1 AND user_id = $2`,
    [id, req.user.id]
  );

  res.json({ message: "Medicamento removido" });
};