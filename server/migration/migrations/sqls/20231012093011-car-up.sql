
CREATE TABLE car (
  id BIGSERIAL PRIMARY KEY,
  vin TEXT NOT NULL UNIQUE,
  login TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  ventilation_status TEXT, 
  last_status_call TIMESTAMP WITH TIME ZONE, /* Last time ventilation status API was called  */
  last_start_cmd TIMESTAMP WITH TIME ZONE, /* Last time we commanded to start the ventilation */
  ventilate_until TIMESTAMP WITH TIME ZONE /* if NULL or in the past, we will not try to turn the ventilation on any more */
);
