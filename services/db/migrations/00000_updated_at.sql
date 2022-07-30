-- # Example
--
-- ```sql
-- CREATE TABLE dbo__users (id SERIAL PRIMARY KEY, updated_at TIMESTAMP NOT NULL DEFAULT NOW());
--
-- SELECT ufn__create_updated_at_trigger('dbo__users');
-- ```

CREATE OR REPLACE FUNCTION ufn__create_updated_at_trigger(_tbl regclass) RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE TRIGGER tr__%1$s_set_updated_at BEFORE UPDATE ON %1$s
                    FOR EACH ROW EXECUTE PROCEDURE ufn__generict_set_updated_at()', _tbl);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ufn__generic_set_updated_at() RETURNS trigger AS $$
BEGIN
    IF (
        NEW IS DISTINCT FROM OLD AND
        NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at
    ) THEN
        NEW.updated_at := current_timestamp;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
