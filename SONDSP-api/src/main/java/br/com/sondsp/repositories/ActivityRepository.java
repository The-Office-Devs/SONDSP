package br.com.sondsp.repositories;

import br.com.sondsp.entities.Activity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer>, JpaSpecificationExecutor<Activity> {
	List<Activity> findAllByStrandIdAndStatusTrue(Integer strandId);
}
