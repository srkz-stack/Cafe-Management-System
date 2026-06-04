package com.cafe.infrastructure.persistence;
import com.cafe.domain.model.Category;
import com.cafe.domain.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SpringDataMenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(Category category);
    List<MenuItem> findByAvailableTrue();
}
