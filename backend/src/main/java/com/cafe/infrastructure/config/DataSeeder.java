package com.cafe.infrastructure.config;
import com.cafe.domain.model.Category;
import com.cafe.domain.model.MenuItem;
import com.cafe.domain.model.Role;
import com.cafe.domain.model.User;
import com.cafe.domain.repository.MenuItemRepository;
import com.cafe.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) {
        seedUsers();
        seedMenuItems();
    }
    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build());
            log.info("🔐 Seeded admin user (admin / admin123)");
        }
        if (!userRepository.existsByUsername("staff")) {
            userRepository.save(User.builder()
                    .username("staff")
                    .password(passwordEncoder.encode("staff123"))
                    .role(Role.STAFF)
                    .build());
            log.info("🔐 Seeded staff user (staff / staff123)");
        }
    }
    private void seedMenuItems() {
        if (menuItemRepository.findAll().isEmpty()) {
            menuItemRepository.save(MenuItem.builder()
                    .name("Espresso").description("Rich and bold single shot")
                    .price(3.50).category(Category.COFFEE).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Cappuccino").description("Espresso with steamed milk foam")
                    .price(4.50).category(Category.COFFEE).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Caramel Latte").description("Smooth espresso with caramel and steamed milk")
                    .price(5.25).category(Category.COFFEE).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Cold Brew").description("Slow-steeped for 20 hours, served over ice")
                    .price(4.75).category(Category.COFFEE).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Green Tea").description("Japanese sencha green tea")
                    .price(3.00).category(Category.TEA).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Chai Latte").description("Spiced black tea with steamed milk")
                    .price(4.25).category(Category.TEA).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Butter Croissant").description("Flaky, golden French croissant")
                    .price(3.75).category(Category.PASTRY).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Blueberry Muffin").description("Loaded with fresh blueberries")
                    .price(3.50).category(Category.PASTRY).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Grilled Panini").description("Ham, cheese, and tomato on ciabatta")
                    .price(7.50).category(Category.SANDWICH).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Veggie Wrap").description("Fresh vegetables with hummus in a whole wheat wrap")
                    .price(6.75).category(Category.SANDWICH).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Tiramisu").description("Classic Italian coffee-flavored dessert")
                    .price(6.50).category(Category.DESSERT).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Chocolate Brownie").description("Fudgy dark chocolate brownie")
                    .price(4.50).category(Category.DESSERT).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Fresh Orange Juice").description("Freshly squeezed oranges")
                    .price(4.00).category(Category.BEVERAGE).available(true).build());
            menuItemRepository.save(MenuItem.builder()
                    .name("Sparkling Water").description("Chilled sparkling mineral water")
                    .price(2.50).category(Category.BEVERAGE).available(true).build());
            log.info("☕ Seeded 14 menu items across all categories");
        }
    }
}
