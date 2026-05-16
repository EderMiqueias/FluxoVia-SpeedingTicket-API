.PHONY: init plan apply destroy clean help

PLAN_FILE := 
TARGET :=

help:
	@echo "Available commands:"
	@echo "  make init   - Initialize Terraform"
	@echo "  make plan   - Plan Terraform changes (generates tfplan)"
	@echo "  make apply  - Apply Terraform changes (uses tfplan)"
	@echo "  make destroy - Destroy Terraform resources"
	@echo "  make clean  - Remove tfplan file"

init:
	terraform init

plan:
	terraform plan -var-file=env.tfvars -out=$(PLAN_FILE)

apply:
	terraform apply -var-file=env.tfvars $(PLAN_FILE)

destroy:
	terraform destroy -var-file=env.tfvars

destroy-plan:
	terraform plan -destroy -var-file=env.tfvars -out=$(PLAN_FILE)
	terraform apply -var-file=env.tfvars $(PLAN_FILE)

destroy-target:
	terraform destroy -var-file=env.tfvars -target=$(TARGET)

clean:
	rm -f $(PLAN_FILE)
