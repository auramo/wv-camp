
CREATE TABLE car (
  id BIGSERIAL PRIMARY KEY,
  vin TEXT NOT NULL UNIQUE,
  login TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  last_api_call TIMESTAMP WITH TIME ZONE, /* Don't constantly call the slow APIs, only after some elapsed period */
  ventilate_until TIMESTAMP WITH TIME ZONE /* if NULL or in the past, we will not try to turn the ventilation on any more */
);
