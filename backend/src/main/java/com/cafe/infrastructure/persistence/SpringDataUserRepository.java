package com.cafe.infrastructure.persistence;
import com.cafe.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface SpringDataUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
