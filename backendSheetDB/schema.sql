CREATE TABLE IF NOT EXISTS actions (
  key VARCHAR(255) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
  username VARCHAR(255),
  method VARCHAR(255),
  url VARCHAR(255),
  module VARCHAR(255),
  detail VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS banners (
  name VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL CHECK (type IN ('HOME_BANNER', 'PRODUCT_BUNDLE', 'COUPON_BANNER')),
  status BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP NOT NULL,
  expired_date TIMESTAMP NOT NULL,
  sort DECIMAL(10,2) DEFAULT 0,
  img_url_en VARCHAR(255),
  has_detail BOOLEAN DEFAULT FALSE,
  has_topup BOOLEAN DEFAULT FALSE,
  credit DECIMAL(10,2),
  amount DECIMAL(10,2),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS bcombo_transactions (
  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  bundle_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  completed_at TIMESTAMP,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS blocked_schedules (
  name VARCHAR(255) NOT NULL,
  blocked_date TIMESTAMP NOT NULL,
  start_time VARCHAR(255) NOT NULL,
  end_time VARCHAR(255) NOT NULL,
  cleaner_ids VARCHAR(255),
  associated_address VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS categories (
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  thumbnail_url VARCHAR(255),
  status BOOLEAN DEFAULT TRUE,
  sort DECIMAL(10,2) DEFAULT 0,
  platform JSON DEFAULT ('[]'),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS category_addons (
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  badge_en VARCHAR(255),
  badge_km VARCHAR(255),
  selection_type VARCHAR(255) DEFAULT 'SINGLE' CHECK (selection_type IN ('SINGLE', 'MULTIPLE')),
  is_required BOOLEAN DEFAULT FALSE,
  status BOOLEAN DEFAULT TRUE,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS category_addon_items (
  addon_id VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  type VARCHAR(255) NOT NULL,
  img_url VARCHAR(255),
  amount DECIMAL(10,2) DEFAULT 0,
  duration DECIMAL(10,2) DEFAULT 0,
  status BOOLEAN DEFAULT TRUE,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (addon_id) REFERENCES category_addons(_id)
);

CREATE TABLE IF NOT EXISTS category_category_addons (
  category_id VARCHAR(255) NOT NULL,
  addon_id VARCHAR(255) NOT NULL,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (category_id) REFERENCES categories(_id),
  FOREIGN KEY (addon_id) REFERENCES category_addons(_id)
);

CREATE TABLE IF NOT EXISTS products (
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  thumbnail_url VARCHAR(255),
  status BOOLEAN DEFAULT TRUE,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS category_products (
  category_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (category_id) REFERENCES categories(_id),
  FOREIGN KEY (product_id) REFERENCES products(_id)
);

CREATE TABLE IF NOT EXISTS product_options (
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  type VARCHAR(255) NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS category_product_options (
  category_product_id VARCHAR(255) NOT NULL,
  product_option_id VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  duration DECIMAL(10,2) DEFAULT 0,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (category_product_id) REFERENCES category_products(_id),
  FOREIGN KEY (product_option_id) REFERENCES product_options(_id)
);

CREATE TABLE IF NOT EXISTS cleaners (
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL CHECK (gender IN ('Male', 'Female')),
  role VARCHAR(255) NOT NULL CHECK (role IN ('LEADER', 'MEMBER')),
  status BOOLEAN DEFAULT TRUE,
  image_url VARCHAR(255),
  phone VARCHAR(255),
  joined_date TIMESTAMP NOT NULL,
  auto_assign BOOLEAN DEFAULT FALSE,
  expertises VARCHAR(255),
  weekly_offs VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(255) NOT NULL CHECK (type IN ('FIXED', 'PERCENTAGE')),
  value DECIMAL(10,2) NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  target_user VARCHAR(255) DEFAULT 'ALL' CHECK (target_user IN ('ALL', 'SELECTED')),
  promo_text_en VARCHAR(255),
  remark VARCHAR(255),
  effective_date TIMESTAMP,
  expired_date TIMESTAMP,
  is_new_user_only BOOLEAN DEFAULT FALSE,
  total_usage_limit DECIMAL(10,2),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS orders (
  bulk_order_id VARCHAR(255),
  customer_user_id VARCHAR(255),
  customer_first_name VARCHAR(255) NOT NULL,
  customer_last_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(255) NOT NULL,
  profile_url VARCHAR(255),
  category VARCHAR(255) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  category_id VARCHAR(255),
  product_id VARCHAR(255),
  category_product_id VARCHAR(255),
  product_option_id VARCHAR(255),
  category_product_option_id VARCHAR(255),
  qty DECIMAL(10,2) DEFAULT 1,
  schedule_date TIMESTAMP NOT NULL,
  duration DECIMAL(10,2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  address_id VARCHAR(255),
  latitude DECIMAL(10,2),
  longitude DECIMAL(10,2),
  floor_num VARCHAR(255),
  room_num VARCHAR(255),
  status VARCHAR(255) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  payment_status VARCHAR(255) DEFAULT 'UNPAID' CHECK (payment_status IN ('PAID', 'UNPAID')),
  payment_method VARCHAR(255),
  coupon_id VARCHAR(255),
  coupon_code VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) DEFAULT 0,
  transport_fee DECIMAL(10,2) DEFAULT 0,
  vat_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  net_revenue DECIMAL(10,2) DEFAULT 0,
  note VARCHAR(255),
  type VARCHAR(255) DEFAULT 'ORDER' CHECK (type IN ('ORDER', 'DIRECT_SALE')),
  exchange_rate DECIMAL(10,2),
  assigned_cleaner_id VARCHAR(255),
  is_primary BOOLEAN DEFAULT TRUE,
  newsletter_subscription VARCHAR(255) DEFAULT 'UNSUBSCRIBED' CHECK (newsletter_subscription IN ('SUBSCRIBED', 'UNSUBSCRIBED')),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (category_id) REFERENCES categories(_id),
  FOREIGN KEY (product_id) REFERENCES products(_id),
  FOREIGN KEY (category_product_id) REFERENCES category_products(_id),
  FOREIGN KEY (product_option_id) REFERENCES product_options(_id),
  FOREIGN KEY (category_product_option_id) REFERENCES category_product_options(_id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(_id),
  FOREIGN KEY (assigned_cleaner_id) REFERENCES cleaners(_id)
);

CREATE TABLE IF NOT EXISTS finance_orders (
  order_id VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(255) NOT NULL,
  service_category VARCHAR(255) NOT NULL,
  specific_service VARCHAR(255) NOT NULL,
  schedule_date TIMESTAMP NOT NULL,
  time VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  payment_init_date TIMESTAMP,
  payment_completed_date TIMESTAMP,
  payment_method VARCHAR(255),
  promo_code VARCHAR(255),
  original_price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  transport_fee DECIMAL(10,2) DEFAULT 0,
  net_revenue DECIMAL(10,2) DEFAULT 0,
  vat DECIMAL(10,2) DEFAULT 0,
  total_fee DECIMAL(10,2) NOT NULL,
  remark VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (order_id) REFERENCES orders(_id)
);

CREATE TABLE IF NOT EXISTS items (
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  category VARCHAR(255) NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  sort_order DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS modules (
  key VARCHAR(255) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  section VARCHAR(255) DEFAULT 'Other',
  action_ids JSON DEFAULT ('[]'),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS order_addons (
  order_id VARCHAR(255) NOT NULL,
  addon_item_id VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  qty DECIMAL(10,2) DEFAULT 1,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (order_id) REFERENCES orders(_id),
  FOREIGN KEY (addon_item_id) REFERENCES category_addon_items(_id)
);

CREATE TABLE IF NOT EXISTS payment_links (
  customer_id VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(255) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'EXPIRED')),
  expiry_date TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  remark VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS platforms (
  name_en VARCHAR(255) NOT NULL UNIQUE,
  name_km VARCHAR(255),
  description VARCHAR(255),
  status BOOLEAN DEFAULT TRUE,
  visibility VARCHAR(255) DEFAULT 'public' CHECK (visibility IN ('public', 'beta', 'internal')),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS popular_services (
  name_en VARCHAR(255) NOT NULL,
  name_km VARCHAR(255),
  image_url VARCHAR(255),
  status BOOLEAN DEFAULT TRUE,
  display_order DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS popular_service_items (
  popular_service_id VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL CHECK (type IN ('CATEGORY', 'PRODUCT')),
  category_id VARCHAR(255),
  product_id VARCHAR(255),
  priority DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (popular_service_id) REFERENCES popular_services(_id),
  FOREIGN KEY (category_id) REFERENCES categories(_id),
  FOREIGN KEY (product_id) REFERENCES products(_id)
);

CREATE TABLE IF NOT EXISTS product_pairings (
  category_product_id VARCHAR(255) NOT NULL,
  paired_category_product_id VARCHAR(255) NOT NULL,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (category_product_id) REFERENCES category_products(_id),
  FOREIGN KEY (paired_category_product_id) REFERENCES category_products(_id)
);

CREATE TABLE IF NOT EXISTS push_notifications (
  name VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  body_en VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL CHECK (type IN ('GENERAL', 'PACKAGE_DEAL')),
  schedule_type VARCHAR(255) NOT NULL CHECK (schedule_type IN ('now', 'schedule', 'event')),
  scheduled_at TIMESTAMP,
  status VARCHAR(255) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SCHEDULED', 'SENT', 'FAILED')),
  audience VARCHAR(255) DEFAULT 'ALL' CHECK (audience IN ('ALL', 'SELECTED')),
  target_user_ids VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS roles (
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255),
  status VARCHAR(255) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by VARCHAR(255) NOT NULL,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id VARCHAR(255) NOT NULL,
  module_id VARCHAR(255) NOT NULL,
  action_id VARCHAR(255) NOT NULL,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (role_id) REFERENCES roles(_id),
  FOREIGN KEY (module_id) REFERENCES modules(_id),
  FOREIGN KEY (action_id) REFERENCES actions(_id)
);

CREATE TABLE IF NOT EXISTS task_info (
  category_id VARCHAR(255),
  product_id VARCHAR(255),
  sort DECIMAL(10,2) DEFAULT 0,
  title_en VARCHAR(255) NOT NULL,
  title_km VARCHAR(255) NOT NULL,
  description_en JSON,
  description_km JSON,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (category_id) REFERENCES categories(_id),
  FOREIGN KEY (product_id) REFERENCES products(_id)
);

CREATE TABLE IF NOT EXISTS topup_transactions (
  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  completed_at TIMESTAMP,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  actor_sheet_id VARCHAR(255),
  status VARCHAR(255) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  password_hash VARCHAR(255),
  profile_url VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (role_id) REFERENCES roles(_id)
);

CREATE TABLE IF NOT EXISTS customers (
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  profile_url VARCHAR(255),
  status VARCHAR(255) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  language VARCHAR(255) DEFAULT 'en',
  gender VARCHAR(255) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
  dob TIMESTAMP,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  UNIQUE (tenant_id, email),
  UNIQUE (tenant_id, phone)
);

CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);

CREATE TABLE IF NOT EXISTS addresses (
  user_id VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  address VARCHAR(255) NOT NULL,
  address_detail VARCHAR(255),
  floor_num VARCHAR(255),
  room_num VARCHAR(255),
  note VARCHAR(255),
  latitude DECIMAL(10,2) NOT NULL,
  longitude DECIMAL(10,2) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort DECIMAL(10,2) DEFAULT 0,
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _deleted_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  FOREIGN KEY (user_id) REFERENCES customers(_id)
);

CREATE INDEX idx_addresses_tenant_id ON addresses(tenant_id);

CREATE TABLE IF NOT EXISTS benchmark_records (
  sku VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  stock DECIMAL(10,2) NOT NULL,
  active BOOLEAN NOT NULL,
  category VARCHAR(255) NOT NULL CHECK (category IN ('electronics', 'apparel', 'grocery', 'home', 'toys')),
  rating DECIMAL(10,2),
  featured BOOLEAN,
  tags JSON,
  notes VARCHAR(255),
  created_by VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id),
  UNIQUE (tenant_id, sku)
);

CREATE INDEX idx_benchmark_records_tenant_id ON benchmark_records(tenant_id);

CREATE TABLE IF NOT EXISTS benchmark_scratch (
  run_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  stock DECIMAL(10,2) NOT NULL,
  active BOOLEAN NOT NULL,
  category VARCHAR(255) NOT NULL CHECK (category IN ('electronics', 'apparel', 'grocery', 'home', 'toys')),
  rating DECIMAL(10,2),
  featured BOOLEAN,
  tags JSON,
  notes VARCHAR(255),
  created_by VARCHAR(255),
  _created_at TIMESTAMP,
  _updated_at TIMESTAMP,
  _id VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (_id)
);

CREATE INDEX idx_benchmark_scratch_tenant_id ON benchmark_scratch(tenant_id);
