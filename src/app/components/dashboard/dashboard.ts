import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/users/user';

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  readonly user = signal<UserProfile | null>(null);

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      console.log(`Dashboard component initialized with userId: ${userId}`);
      this.getUser(userId);
    }
  }

  private async getUser(userId: string) {
    const user = await this.userService.getUser(userId) as UserProfile | null;
    this.user.set(user);
  }
}
